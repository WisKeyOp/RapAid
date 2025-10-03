
import { toast } from "@/hooks/use-toast";

export interface EmergencyRequest {
  type: "rescue" | "food" | "medical";
  location: GeolocationCoordinates | null;
  timestamp: Date;
  deviceId: string;
}

// Store a request in local storage for offline sync
export const storeOfflineRequest = (request: EmergencyRequest): void => {
  try {
    const offlineRequests = getOfflineRequests();
    offlineRequests.push(request);
    localStorage.setItem("offline-emergency-requests", JSON.stringify(offlineRequests));
    
    // Register for background sync if available
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        try {
          (registration as any).sync.register('sync-emergency-requests')
            .catch((err) => console.error('Background sync registration failed:', err));
        } catch (err) {
          console.error('Background sync not supported:', err);
        }
      });
    }
  } catch (error) {
    console.error("Failed to store offline request:", error);
  }
}

// Retrieve all offline requests
export const getOfflineRequests = (): EmergencyRequest[] => {
  try {
    const offlineRequests = localStorage.getItem("offline-emergency-requests");
    return offlineRequests ? JSON.parse(offlineRequests) : [];
  } catch (error) {
    console.error("Failed to retrieve offline requests:", error);
    return [];
  }
}

// Clear offline requests (after successful sync)
export const clearOfflineRequests = (): void => {
  localStorage.removeItem("offline-emergency-requests");
}

// Check if there are pending offline requests
export const hasPendingRequests = (): boolean => {
  return getOfflineRequests().length > 0;
}

// Try to sync offline requests when online
export const syncOfflineRequests = async (): Promise<void> => {
  const offlineRequests = getOfflineRequests();
  
  if (offlineRequests.length === 0) return;
  
  // In a real app, this would send requests to an API
  // For demo purposes, we'll just show a toast notification
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
