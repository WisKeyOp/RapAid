# RapAid Project Log & Instructions

This file maintains the architectural flow, key features, offline resilience pipeline, failure mitigation strategies, and Mistake Log for the RapAid disaster relief coordination platform.

---

## 1. Architectural Flow

**RapAid** is a mobile-first, offline-resilient disaster relief coordination tool engineered with React 18, TypeScript, Vite, Tailwind CSS, and Leaflet.js.

```
                    [Citizen Reporting Form (SOS)]
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
          (Online: HTTP 200)           (Offline / Partition)
                    │                           │
                    ▼                           ▼
        [/api/incidents Gateway]    [localStorage & SyncManager]
                    │                           │
                    ▼                           ▼
        [Emergency Cluster DB] <────── [Background Reconciliation]
                    │
                    ▼
        [Leaflet.js Spatial Map]
```

### Key Architectural Reference
- Complete HLD, LLD, and Data Contracts are documented in [SYSTEM_DESIGN_HLD_LLD.md](file:///d:/Desktop/Personal%20Projects/RapAid/SYSTEM_DESIGN_HLD_LLD.md).

### C. Autonomous Disaster Resource Allocation Agent
- **Pipeline Architecture**: 3-node LangGraph-style state graph (`client/src/agent/allocationAgent.ts`):
  1. *Distress Signal Parser*: Classifies urgency (Tier 1 Critical to Tier 3 Moderate) and computes required supplies.
  2. *Spatial Proximity & Inventory Matcher*: Computes Haversine distances against volunteer fleet and evaluates inventory coverage.
  3. *Dispatch Decision*: Formulates scored dispatch recommendation while strictly preserving the `${deviceId}_${timestamp}` composite key.
- **UI Integration**: `client/src/components/AgentDispatchPanel.tsx` embeds live agentic recommendations directly in the responder dashboard.

---

## 2. Failure-Mode Analysis & Error Logging

### A. Network Partition During Emergency SOS
- **Failure Mode**: Network drops while victim submits emergency SOS; request is lost.
- **Mitigation**: Trapped fetch errors and buffered requests into `offline-emergency-requests` in `localStorage`. Automated background drain via ServiceWorker `SyncManager` upon network re-establishment.

### B. Duplicate Rescue Dispatch Storm
- **Failure Mode**: Victim retries sync multiple times over shaky connection, spawning multiple identical rescue missions.
- **Mitigation**: Tagged all outgoing requests with immutable composite keys (`deviceId` + `timestamp`), enabling server-side deduplication.

### C. Agent Dispatch Replay upon Network Reconnection
- **Failure Mode**: Local agent allocation generates dispatch recommendations using volatile memory IDs, causing duplicate rescue triggers when offline requests sync.
- **Mitigation**: The allocation agent binds its decision directly to the request's immutable composite key (`compositeId`), ensuring server-side reconciliation remains strictly idempotent.

---

## 3. Mistake Log

### Entry 01
- **Mistake**: Used `print()` for debugging in production-ready agents.
- **Why**: Zero observability and hard to filter.
- **Rule**: Use structured logging with context.
- **Check**: Reject any PR with `print()` in core logic.

### Entry 02
- **Mistake**: Forgot `None` checks in LangGraph state transitions.
- **Why**: Brittle flow and hidden runtime crashes.
- **Rule**: Validate state at every boundary.
- **Check**: Verify optional fields before transition logic.

### Entry 03
- **Mistake**: Stripping composite client keys (`deviceId` + `timestamp`) when transforming distress signals into agent dispatch objects.
- **Why**: Stripping keys prevents idempotency checks during offline-to-online reconciliation flushes.
- **Rule**: Always pass and preserve composite client idempotency keys across all agent state transitions.
- **Check**: Verify `dispatchRecommendation.compositeId` matches `signal.deviceId_signal.timestamp`.
