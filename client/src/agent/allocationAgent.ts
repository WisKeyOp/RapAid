/**
 * RapAid - Autonomous Disaster Resource Allocation Agent
 *
 * A three-node state graph (parse -> match -> decide) that runs entirely on the
 * client so it keeps working with no connectivity. The deterministic parser is
 * the default; an online LLM classifier can be injected through `options.classify`
 * and its output is merged over the deterministic result, never replacing the
 * safety floor (a rescue signal is never downgraded below Tier 1).
 *
 * Offline invariants this module guarantees:
 *   - Every signal is identified by a canonical composite key
 *     (deviceId + epoch-ms timestamp) that survives JSON / localStorage round
 *     trips, so replayed requests after reconnection are the SAME key and can be
 *     de-duplicated instead of triggering a second dispatch.
 *   - A signal with no usable location is never given a guessed one. It is still
 *     triaged and matched on inventory, but flagged `locationKnown: false` so a
 *     human confirms the location before anyone is sent anywhere.
 */

export type UrgencyTier = 1 | 2 | 3; // 1 = Critical, 2 = Urgent, 3 = Moderate
export type UrgencyLabel = "Critical" | "Urgent" | "Moderate";
export type SignalType = "rescue" | "medical" | "food" | "general";

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface DistressSignal {
  sosId: string;
  type: SignalType;
  location: Coordinates | null | undefined;
  notes?: string;
  deviceId: string;
  timestamp: string | number | Date;
  peopleCount?: number;
}

export interface SupplyItem {
  item: string;
  quantity: number;
  unit: string;
}

export type VolunteerRole = "clinical_medic" | "rescue_diver" | "general_volunteer" | "logistics_driver";

export interface VolunteerNode {
  id: string;
  name: string;
  phone: string;
  location: Coordinates | null | undefined;
  inventory: Record<string, number>;
  isAvailable: boolean;
  role: VolunteerRole;
}

export interface Urgency {
  tier: UrgencyTier;
  label: UrgencyLabel;
  reason: string;
  source: "deterministic" | "llm+deterministic";
}

export interface RankedMatch {
  volunteer: VolunteerNode;
  /** null when the signal has no usable location */
  distanceKm: number | null;
  inventoryCoverage: number;
  matchScore: number;
}

export interface DispatchRecommendation {
  sosId: string;
  /** Canonical offline idempotency key: `${deviceId}_${epochMs}` */
  compositeId: string;
  recommendedVolunteerId: string;
  recommendedVolunteerName: string;
  matchScore: number;
  distanceKm: number | null;
  locationKnown: boolean;
  /** "item: qty unit" for everything the volunteer can actually supply */
  allocatedItems: string[];
  /** "item: shortfall unit" for what still needs sourcing elsewhere */
  unfulfilledItems: string[];
  rationale: string;
  generatedAt: string;
}

export interface AllocationState {
  signal: DistressSignal;
  compositeId: string;
  locationKnown: boolean;
  urgency: Urgency;
  requiredSupplies: SupplyItem[];
  rankedMatches: RankedMatch[];
  decision: DispatchRecommendation | null;
  error?: string;
}

/** Optional online enhancement for Node 1. Must resolve quickly or reject; never blocks the deterministic path. */
export type UrgencyClassifier = (
  signal: DistressSignal
) => Promise<Partial<Pick<Urgency, "tier" | "reason">> & { requiredSupplies?: SupplyItem[] }>;

export interface AllocationOptions {
  classify?: UrgencyClassifier;
  /** Volunteers further than this are excluded when the location is known. Default 50 km. */
  maxDistanceKm?: number;
}

// ---------------------------------------------------------------------------
// Invariant helpers
// ---------------------------------------------------------------------------

export function isValidCoordinates(loc: unknown): loc is Coordinates {
  if (!loc || typeof loc !== "object") return false;
  const { latitude, longitude } = loc as Record<string, unknown>;
  return (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180
  );
}

/**
 * GeolocationCoordinates exposes its values as prototype getters, so
 * JSON.stringify(position.coords) yields "{}". Always store this plain shape.
 */
export function toPlainCoordinates(coords: GeolocationCoordinates | Coordinates | null | undefined): Coordinates | null {
  if (!coords) return null;
  const plain = { latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy ?? undefined };
  return isValidCoordinates(plain) ? plain : null;
}

/** Normalise any timestamp representation to epoch milliseconds (NaN -> 0). */
export function toEpochMs(ts: string | number | Date): number {
  if (ts instanceof Date) return ts.getTime();
  if (typeof ts === "number") return Number.isFinite(ts) ? ts : 0;
  const parsed = Date.parse(ts);
  if (!Number.isNaN(parsed)) return parsed;
  const asNumber = Number(ts);
  return Number.isFinite(asNumber) ? asNumber : 0;
}

/** Canonical composite key. Same signal -> same key, regardless of how the timestamp was serialised. */
export function buildCompositeId(deviceId: string, timestamp: string | number | Date): string {
  return `${deviceId}_${toEpochMs(timestamp)}`;
}

// ---------------------------------------------------------------------------
// Spatial utility: Haversine great-circle distance (km)
// ---------------------------------------------------------------------------

export function calculateHaversineDistance(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return Number((R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))).toFixed(2));
}

// ---------------------------------------------------------------------------
// Node 1: Distress Signal Parser (deterministic floor)
// ---------------------------------------------------------------------------

const CRITICAL_WORDS = ["trapped", "collapsed", "bleeding", "drowning", "infant", "unconscious", "heart", "oxygen", "flood", "fire", "not breathing"];
const URGENT_WORDS = ["pain", "elderly", "diabetic", "pregnant", "fever", "injur", "fracture", "asthma"];

export function distressSignalParserNode(signal: DistressSignal): Pick<AllocationState, "urgency" | "requiredSupplies"> {
  const notes = (signal.notes || "").toLowerCase();
  const people = Math.max(1, Math.floor(Number(signal.peopleCount) || 1));

  let tier: UrgencyTier;
  let reason: string;
  if (signal.type === "rescue" || CRITICAL_WORDS.some((w) => notes.includes(w))) {
    tier = 1;
    reason = "Immediate life-safety or structural hazard identified in signal.";
  } else if (signal.type === "medical" || URGENT_WORDS.some((w) => notes.includes(w))) {
    tier = 2;
    reason = "Medical intervention required without immediate trauma collapse.";
  } else {
    tier = 3;
    reason = "Sustenance or shelter support needed; non-acute severity.";
  }

  const requiredSupplies: SupplyItem[] = [];
  if (tier === 1) {
    requiredSupplies.push({ item: "rescue_rope", quantity: 1, unit: "pack" });
    requiredSupplies.push({ item: "first_aid_kit", quantity: Math.ceil(people / 3), unit: "kit" });
    requiredSupplies.push({ item: "water_liters", quantity: people * 3, unit: "liters" });
  } else if (tier === 2) {
    requiredSupplies.push({ item: "first_aid_kit", quantity: Math.ceil(people / 2), unit: "kit" });
    requiredSupplies.push({ item: "antiseptic_pack", quantity: 1, unit: "box" });
    requiredSupplies.push({ item: "water_liters", quantity: people * 2, unit: "liters" });
  } else {
    requiredSupplies.push({ item: "ration_packet", quantity: people * 2, unit: "packets" });
    requiredSupplies.push({ item: "water_liters", quantity: people * 4, unit: "liters" });
    requiredSupplies.push({ item: "blanket", quantity: people, unit: "pieces" });
  }

  return { urgency: { tier, label: tierLabel(tier), reason, source: "deterministic" }, requiredSupplies };
}

function tierLabel(tier: UrgencyTier): UrgencyLabel {
  return tier === 1 ? "Critical" : tier === 2 ? "Urgent" : "Moderate";
}

/**
 * Merge an optional LLM classification over the deterministic result.
 * The LLM may escalate urgency or refine supply counts; it can never downgrade a
 * deterministic Tier 1 (rescue / critical keywords stay critical offline and online).
 */
async function parseWithOptionalClassifier(signal: DistressSignal, classify?: UrgencyClassifier) {
  const base = distressSignalParserNode(signal);
  if (!classify) return base;
  try {
    const llm = await classify(signal);
    const llmTier = llm.tier && [1, 2, 3].includes(llm.tier) ? (llm.tier as UrgencyTier) : base.urgency.tier;
    const tier = Math.min(base.urgency.tier, llmTier) as UrgencyTier; // lower number = more urgent
    const supplies =
      Array.isArray(llm.requiredSupplies) && llm.requiredSupplies.length
        ? llm.requiredSupplies.filter((s) => s && typeof s.item === "string" && Number.isFinite(s.quantity) && s.quantity > 0)
        : base.requiredSupplies;
    return {
      urgency: {
        tier,
        label: tierLabel(tier),
        reason: llm.reason || base.urgency.reason,
        source: "llm+deterministic" as const,
      },
      requiredSupplies: supplies.length ? supplies : base.requiredSupplies,
    };
  } catch {
    return base; // offline or classifier failure: deterministic result stands
  }
}

// ---------------------------------------------------------------------------
// Node 2: Spatial Proximity & Inventory Matcher
// ---------------------------------------------------------------------------

export function spatialInventoryMatcherNode(
  signalLocation: Coordinates | null | undefined,
  requiredSupplies: SupplyItem[],
  volunteers: VolunteerNode[],
  maxDistanceKm = 50
): RankedMatch[] {
  const locationKnown = isValidCoordinates(signalLocation);

  const candidates: RankedMatch[] = [];
  for (const vol of volunteers) {
    if (!vol.isAvailable) continue;

    let distanceKm: number | null = null;
    let spatialScore = 0;
    if (locationKnown) {
      if (!isValidCoordinates(vol.location)) continue; // cannot place this volunteer
      distanceKm = calculateHaversineDistance(signalLocation as Coordinates, vol.location);
      if (distanceKm > maxDistanceKm) continue;
      spatialScore = 1 / (1 + distanceKm * 0.15); // 1.0 at 0 km, ~0.18 at 30 km
    }

    let covered = 0;
    for (const req of requiredSupplies) {
      const have = Math.max(0, Number(vol.inventory?.[req.item]) || 0);
      covered += Math.min(1, have / req.quantity);
    }
    const inventoryCoverage = Number((covered / Math.max(1, requiredSupplies.length)).toFixed(2));

    // With a known location: 60% proximity / 40% inventory. Without one, inventory is all we have.
    const matchScore = locationKnown
      ? Number((spatialScore * 0.6 + inventoryCoverage * 0.4).toFixed(3))
      : Number((inventoryCoverage * 0.8).toFixed(3)); // capped so an unlocated match never outranks a located one

    candidates.push({ volunteer: vol, distanceKm, inventoryCoverage, matchScore });
  }

  candidates.sort((a, b) => b.matchScore - a.matchScore || (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  return candidates;
}

// ---------------------------------------------------------------------------
// Node 3: Dispatch Decision
// ---------------------------------------------------------------------------

export function dispatchDecisionNode(
  signal: DistressSignal,
  compositeId: string,
  locationKnown: boolean,
  urgency: Urgency,
  requiredSupplies: SupplyItem[],
  rankedMatches: RankedMatch[]
): DispatchRecommendation | null {
  const top = rankedMatches[0];
  if (!top || top.matchScore <= 0) return null;

  const allocatedItems: string[] = [];
  const unfulfilledItems: string[] = [];
  for (const req of requiredSupplies) {
    const have = Math.max(0, Number(top.volunteer.inventory?.[req.item]) || 0);
    const qty = Math.min(req.quantity, have);
    if (qty > 0) allocatedItems.push(`${req.item}: ${qty} ${req.unit}`);
    if (qty < req.quantity) unfulfilledItems.push(`${req.item}: ${req.quantity - qty} ${req.unit}`);
  }

  const role = top.volunteer.role.replace(/_/g, " ");
  const where = locationKnown ? `${top.distanceKm} km away` : "distance unknown (signal has no usable location)";
  const rationale =
    `${top.volunteer.name} (${role}), ${where}, can cover ${Math.round(top.inventoryCoverage * 100)}% of the requested inventory. ` +
    `Urgency: ${urgency.label} (${urgency.reason})` +
    (locationKnown ? "" : " CONFIRM VICTIM LOCATION BEFORE DISPATCH.");

  return {
    sosId: signal.sosId,
    compositeId,
    recommendedVolunteerId: top.volunteer.id,
    recommendedVolunteerName: top.volunteer.name,
    matchScore: top.matchScore,
    distanceKm: top.distanceKm,
    locationKnown,
    allocatedItems,
    unfulfilledItems,
    rationale,
    generatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

/** Run the graph for one signal against a volunteer pool. Pure apart from `options.classify`. */
export async function runAllocationAgent(
  signal: DistressSignal,
  volunteers: VolunteerNode[],
  options: AllocationOptions = {}
): Promise<AllocationState> {
  const compositeId = buildCompositeId(signal.deviceId, signal.timestamp);
  const locationKnown = isValidCoordinates(signal.location);

  const { urgency, requiredSupplies } = await parseWithOptionalClassifier(signal, options.classify);
  const rankedMatches = spatialInventoryMatcherNode(signal.location, requiredSupplies, volunteers, options.maxDistanceKm);
  const decision = dispatchDecisionNode(signal, compositeId, locationKnown, urgency, requiredSupplies, rankedMatches);

  return {
    signal,
    compositeId,
    locationKnown,
    urgency,
    requiredSupplies,
    rankedMatches,
    decision,
    error: decision ? undefined : "NO_ELIGIBLE_VOLUNTEER",
  };
}

/**
 * Allocate a batch of signals. Signals are processed most-urgent first and each
 * dispatch reserves the volunteer's inventory (and, for Tier 1, the volunteer)
 * so two incidents are never promised the same rope. Duplicate composite keys
 * (offline replays) collapse to a single allocation.
 */
export async function runAllocationBatch(
  signals: DistressSignal[],
  volunteers: VolunteerNode[],
  options: AllocationOptions = {}
): Promise<AllocationState[]> {
  // Deep-copy the pool so reservations never mutate caller state.
  const pool: VolunteerNode[] = volunteers.map((v) => ({ ...v, inventory: { ...(v.inventory || {}) } }));

  // De-duplicate by composite key (first occurrence wins) and triage.
  const seen = new Set<string>();
  const unique = signals.filter((s) => {
    const key = buildCompositeId(s.deviceId, s.timestamp);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const triaged = await Promise.all(unique.map(async (s) => ({ s, parsed: await parseWithOptionalClassifier(s, options.classify) })));
  triaged.sort((a, b) => a.parsed.urgency.tier - b.parsed.urgency.tier || toEpochMs(a.s.timestamp) - toEpochMs(b.s.timestamp));

  const results: AllocationState[] = [];
  for (const { s, parsed } of triaged) {
    const compositeId = buildCompositeId(s.deviceId, s.timestamp);
    const locationKnown = isValidCoordinates(s.location);
    const rankedMatches = spatialInventoryMatcherNode(s.location, parsed.requiredSupplies, pool, options.maxDistanceKm);
    const decision = dispatchDecisionNode(s, compositeId, locationKnown, parsed.urgency, parsed.requiredSupplies, rankedMatches);

    if (decision) {
      const vol = pool.find((v) => v.id === decision.recommendedVolunteerId);
      if (vol) {
        for (const req of parsed.requiredSupplies) {
          const have = Math.max(0, Number(vol.inventory[req.item]) || 0);
          vol.inventory[req.item] = Math.max(0, have - Math.min(req.quantity, have));
        }
        if (parsed.urgency.tier === 1) vol.isAvailable = false; // a critical dispatch consumes the responder
      }
    }

    results.push({
      signal: s,
      compositeId,
      locationKnown,
      urgency: parsed.urgency,
      requiredSupplies: parsed.requiredSupplies,
      rankedMatches,
      decision,
      error: decision ? undefined : "NO_ELIGIBLE_VOLUNTEER",
    });
  }
  return results;
}
