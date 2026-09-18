
import { toast } from "@/hooks/use-toast";
import {
  buildCompositeId,
  isValidCoordinates,
  toPlainCoordinates,
  type Coordinates,
  type DistressSignal,
  type SignalType,
} from "@/agent/allocationAgent";

export interface EmergencyRequest {
  type: "rescue" | "food" | "medical";
  /**
   * Plain {latitude, longitude, accuracy} only. Never store a live
   * GeolocationCoordinates here: its fields are prototype getters and
   * JSON.stringify turns it into "{}", silently dropping the victim's position.
   */
  location: Coordinates | null;
  timestamp: Date | string | number;
  deviceId: string;
  /**
   * Canonical offline idempotency key (`${deviceId}_${epochMs}`), fixed at
   * creation so a replayed request after reconnection is recognised as the
   * same incident and never dispatched twice.
   */
  clientKey?: string;
  notes?: string;
  peopleCount?: number;
}

const REQUESTS_KEY = "offline-emergency-requests";
const DISPATCH_LEDGER_KEY = "rapaid-dispatch-ledger";

/** Coerce anything that was ever stored into the canonical shape. */
export const normalizeRequest = (raw: EmergencyRequest): EmergencyRequest => {
  const location = isValidCoordinates(raw.location) ? toPlainCoordinates(raw.location) : null;
  return {
    ...raw,
    location,
    clientKey: raw.clientKey || buildCompositeId(raw.deviceId, raw.timestamp),
  };
};

// Store a request in local storage for offline sync (idempotent on clientKey)
export const storeOfflineRequest = (request: EmergencyRequest): EmergencyRequest => {
  const normalized = normalizeRequest(request);
  try {
    const offlineRequests = getOfflineRequests();
    if (!offlineRequests.some((r) => r.clientKey === normalized.clientKey)) {
      offlineRequests.push(normalized);
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(offlineRequests));
    }

    // Register for background sync if available
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        try {
          (registration as any).sync.register('sync-emergency-requests')
            .catch((err: unknown) => console.error('Background sync registration failed:', err));
        } catch (err) {
          console.error('Background sync not supported:', err);
        }
      });
    }
  } catch (error) {
    console.error("Failed to store offline request:", error);
  }
  return normalized;
}

// Retrieve all offline requests (legacy records are normalised on read)
export const getOfflineRequests = (): EmergencyRequest[] => {
  try {
    const offlineRequests = localStorage.getItem(REQUESTS_KEY);
    const parsed: EmergencyRequest[] = offlineRequests ? JSON.parse(offlineRequests) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeRequest) : [];
  } catch (error) {
    console.error("Failed to retrieve offline requests:", error);
    return [];
  }
}

// Clear offline requests (after successful sync)
export const clearOfflineRequests = (): void => {
  localStorage.removeItem(REQUESTS_KEY);
}

// Check if there are pending offline requests
export const hasPendingRequests = (): boolean => {
  return getOfflineRequests().length > 0;
}

/** Adapter: stored request -> agent input. The composite key is carried through unchanged. */
export const toDistressSignal = (req: EmergencyRequest): DistressSignal => {
  const normalized = normalizeRequest(req);
  return {
    sosId: normalized.clientKey as string,
    type: normalized.type as SignalType,
    location: normalized.location,
    notes: normalized.notes,
    deviceId: normalized.deviceId,
    timestamp: normalized.timestamp,
    peopleCount: normalized.peopleCount,
  };
};

/* ---------------------------- Dispatch ledger ---------------------------- */
// Confirmed dispatches keyed by composite key. Persisted so a reload, a
// re-render of the agent panel, or a replayed request after reconnection can
// never produce a second dispatch for the same incident.

export interface DispatchLedgerEntry {
  compositeId: string;
  volunteerId: string;
  dispatchedAt: string;
}

export const getDispatchLedger = (): Record<string, DispatchLedgerEntry> => {
  try {
    const raw = localStorage.getItem(DISPATCH_LEDGER_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const isDispatched = (compositeId: string): boolean => Boolean(getDispatchLedger()[compositeId]);

/** Idempotent: returns the existing entry if this incident was already dispatched. */
export const recordDispatch = (compositeId: string, volunteerId: string): DispatchLedgerEntry => {
  const ledger = getDispatchLedger();
  if (ledger[compositeId]) return ledger[compositeId];
  const entry: DispatchLedgerEntry = { compositeId, volunteerId, dispatchedAt: new Date().toISOString() };
  ledger[compositeId] = entry;
  try {
    localStorage.setItem(DISPATCH_LEDGER_KEY, JSON.stringify(ledger));
  } catch (error) {
    console.error("Failed to persist dispatch ledger:", error);
  }
  return entry;
};

// Try to sync offline requests when online
export const syncOfflineRequests = async (): Promise<void> => {
  const offlineRequests = getOfflineRequests();

  if (offlineRequests.length === 0) return;

  // In a real app, this would POST each request with its clientKey so the
  // server can upsert idempotently. For demo purposes, show a toast.
  toast({
    title: "Syncing offline requests",
    description: `${offlineRequests.length} offline request(s) are being sent.`,
    variant: "default",
  });

  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Clear the requests after successful sync
  clearOfflineRequests();

  toast({
    title: "Offline requests synced",
    description: "All your emergency requests have been sent successfully.",
    variant: "default",
  });
}

// Network status monitor
export const initNetworkListener = (): void => {
  window.addEventListener('online', () => {
    if (hasPendingRequests()) {
      syncOfflineRequests();
    }
  });
}
