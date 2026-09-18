import { useState, useEffect, useMemo, useCallback } from "react";
import {
  runAllocationBatch,
  buildCompositeId,
  type DistressSignal,
  type VolunteerNode,
  type AllocationState,
  type UrgencyClassifier,
} from "@/agent/allocationAgent";
import { getOfflineRequests, toDistressSignal, getDispatchLedger, recordDispatch } from "@/utils/offlineStorage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, MapPin, MapPinOff, PackageCheck, PackageX, AlertTriangle, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react";

// Mock responder fleet. Replace with a fetch of /api/resources when the
// coordination backend exists; the agent only needs this shape.
const SAMPLE_VOLUNTEERS: VolunteerNode[] = [
  {
    id: "vol_101",
    name: "Dr. Ananya Roy",
    phone: "+91-9876543210",
    location: { latitude: 28.6189, longitude: 77.214 },
    inventory: { first_aid_kit: 4, antiseptic_pack: 3, water_liters: 15 },
    isAvailable: true,
    role: "clinical_medic",
  },
  {
    id: "vol_102",
    name: "Vikram Singh (Rescue Team)",
    phone: "+91-9876543211",
    location: { latitude: 28.625, longitude: 77.219 },
    inventory: { rescue_rope: 2, first_aid_kit: 2, water_liters: 30 },
    isAvailable: true,
    role: "rescue_diver",
  },
  {
    id: "vol_103",
    name: "Rahul Mehra (NGO Relief)",
    phone: "+91-9876543212",
    location: { latitude: 28.635, longitude: 77.225 },
    inventory: { ration_packet: 50, water_liters: 100, blanket: 20 },
    isAvailable: true,
    role: "logistics_driver",
  },
];

// Demo incidents shown only when there are no real pending requests.
const SAMPLE_SIGNALS: DistressSignal[] = [
  {
    sosId: "sos_alpha_1",
    type: "rescue",
    location: { latitude: 28.6139, longitude: 77.209 },
    notes: "Family of 4 trapped on terrace due to ground floor flood water. Need rope and basic first aid.",
    deviceId: "dev_client_9941",
    timestamp: Date.now() - 120000,
    peopleCount: 4,
  },
  {
    sosId: "sos_beta_2",
    type: "medical",
    location: { latitude: 28.6155, longitude: 77.212 },
    notes: "Elderly diabetic patient with severe dizziness, requiring antiseptic kit and emergency hydration.",
    deviceId: "dev_client_8832",
    timestamp: Date.now() - 60000,
    peopleCount: 1,
  },
  {
    sosId: "sos_gamma_3",
    type: "food",
    location: null, // exercised the location-unknown path
    notes: "Six people sheltering in a school, no food since yesterday. GPS not working.",
    deviceId: "dev_client_7710",
    timestamp: Date.now() - 30000,
    peopleCount: 6,
  },
];

interface AgentDispatchPanelProps {
  /** Signals to allocate. Defaults to the device's pending offline requests, then demo data. */
  pendingSignals?: DistressSignal[];
  volunteers?: VolunteerNode[];
  /** Optional online LLM classifier for Node 1; deterministic parsing is the offline floor. */
  classify?: UrgencyClassifier;
}

export default function AgentDispatchPanel({ pendingSignals, volunteers = SAMPLE_VOLUNTEERS, classify }: AgentDispatchPanelProps) {
  const [allocations, setAllocations] = useState<AllocationState[]>([]);
  const [ledger, setLedger] = useState<Record<string, { volunteerId: string; dispatchedAt: string }>>(() => getDispatchLedger());
  const [running, setRunning] = useState(false);

  const { activeSignals, source } = useMemo<{ activeSignals: DistressSignal[]; source: "props" | "offline" | "demo" }>(() => {
    if (pendingSignals && pendingSignals.length > 0) return { activeSignals: pendingSignals, source: "props" };
    const offline = getOfflineRequests().map(toDistressSignal);
    if (offline.length > 0) return { activeSignals: offline, source: "offline" };
    return { activeSignals: SAMPLE_SIGNALS, source: "demo" };
  }, [pendingSignals]);

  const runAgent = useCallback(async () => {
    setRunning(true);
    try {
      // Already-dispatched incidents are excluded up front so their volunteer
      // inventory is not offered to someone else on a re-run.
      const currentLedger = getDispatchLedger();
      const fresh = activeSignals.filter((s) => !currentLedger[buildCompositeId(s.deviceId, s.timestamp)]);
      const results = await runAllocationBatch(fresh, volunteers, { classify });
      setAllocations(results);
      setLedger(currentLedger);
    } finally {
      setRunning(false);
    }
  }, [activeSignals, volunteers, classify]);

  useEffect(() => {
    runAgent();
  }, [runAgent]);

  const handleConfirmDispatch = (alloc: AllocationState) => {
    if (!alloc.decision) return;
    // recordDispatch is idempotent on compositeId: a double-click, a reload, or
    // a replayed offline request all resolve to the single original dispatch.
    recordDispatch(alloc.compositeId, alloc.decision.recommendedVolunteerId);
    setLedger(getDispatchLedger());
  };

  const dispatchedCount = Object.keys(ledger).length;

  return (
    <Card className="border border-primary/20 bg-background/95 backdrop-blur shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-primary/10 text-primary rounded-lg">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-base font-semibold">Autonomous Resource Allocation Agent</CardTitle>
              <p className="text-xs text-muted-foreground">
                Triage → Haversine proximity & inventory match → dispatch · {source === "offline" ? "pending offline requests" : source === "props" ? "live feed" : "demo incidents"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/30">
              {dispatchedCount} dispatched
            </Badge>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={runAgent} disabled={running}>
              <RefreshCw className={`h-3 w-3 mr-1 ${running ? "animate-spin" : ""}`} /> Re-run
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {allocations.length === 0 && !running && (
          <p className="text-xs text-muted-foreground text-center py-6">No unassigned incidents. Every pending request has a confirmed dispatch.</p>
        )}

        {allocations.map((alloc) => {
          const decision = alloc.decision;
          const dispatched = ledger[alloc.compositeId];

          return (
            <div key={alloc.compositeId} className="p-4 rounded-xl border border-border bg-card/50 space-y-3 transition hover:border-primary/40">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold truncate">Incident #{alloc.signal.sosId}</span>
                    <Badge
                      className={
                        alloc.urgency.tier === 1
                          ? "bg-destructive text-destructive-foreground text-[10px]"
                          : alloc.urgency.tier === 2
                          ? "bg-warning text-white text-[10px]"
                          : "bg-secondary text-secondary-foreground text-[10px]"
                      }
                    >
                      Tier {alloc.urgency.tier}: {alloc.urgency.label}
                    </Badge>
                    {!alloc.locationKnown && (
                      <Badge variant="outline" className="text-[10px] border-destructive/50 text-destructive flex items-center gap-1">
                        <MapPinOff className="h-3 w-3" /> Location unknown
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">"{alloc.signal.notes || "No notes provided."}"</p>
                </div>

                {decision && (
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-primary">{Math.round(decision.matchScore * 100)}% match</span>
                    <p className="text-[10px] text-muted-foreground">{decision.distanceKm === null ? "distance n/a" : `${decision.distanceKm} km away`}</p>
                  </div>
                )}
              </div>

              {decision ? (
                <div className="bg-muted/40 p-3 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Recommended: {decision.recommendedVolunteerName}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {decision.distanceKm === null ? "—" : `${decision.distanceKm} km`}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">{decision.rationale}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {decision.allocatedItems.map((item) => (
                      <span key={item} className="inline-flex items-center gap-1 text-[10px] bg-background px-2 py-0.5 rounded border border-border">
                        <PackageCheck className="h-3 w-3 text-primary" />
                        {item}
                      </span>
                    ))}
                    {decision.unfulfilledItems.map((item) => (
                      <span key={item} className="inline-flex items-center gap-1 text-[10px] bg-destructive/5 px-2 py-0.5 rounded border border-destructive/30 text-destructive">
                        <PackageX className="h-3 w-3" />
                        short {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-destructive flex items-center gap-1.5 p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  No available volunteer can serve this incident right now (out of range or no matching inventory).
                </div>
              )}

              <div className="flex items-center justify-between pt-1 text-[11px] gap-2">
                <span className="text-muted-foreground font-mono truncate" title={alloc.compositeId}>
                  key {alloc.compositeId}
                </span>

                {dispatched ? (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="h-3 w-3" /> Dispatched
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    className="h-7 text-xs px-3 shrink-0"
                    variant={alloc.locationKnown ? "default" : "destructive"}
                    disabled={!decision}
                    onClick={() => handleConfirmDispatch(alloc)}
                    title={alloc.locationKnown ? "Confirm dispatch" : "Location must be confirmed with the caller before dispatch"}
                  >
                    {alloc.locationKnown ? "Confirm dispatch" : "Dispatch (location unverified)"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
