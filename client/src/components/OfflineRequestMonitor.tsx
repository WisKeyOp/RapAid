
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getOfflineRequests, syncOfflineRequests } from "@/utils/offlineStorage";
import { CloudOff, Upload } from "lucide-react";

const OfflineRequestMonitor = () => {
  const [offlineRequests, setOfflineRequests] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  // Update the pending request count
  const updateRequestCount = () => {
    const requests = getOfflineRequests();
    setOfflineRequests(requests.length);
  };
  
  useEffect(() => {
    // Check for offline requests on component mount
    updateRequestCount();
    
    // Set up interval to periodically check for requests
    const interval = setInterval(updateRequestCount, 30000);
    
    // Set up event listener for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "offline-emergency-requests") {
        updateRequestCount();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Clean up
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  // Handle manual sync attempt
  const handleSync = async () => {
    if (navigator.onLine && offlineRequests > 0) {
      setIsSyncing(true);
      await syncOfflineRequests();
      setIsSyncing(false);
      updateRequestCount();
    }
  };
  
  // Don't render anything if there are no offline requests
  if (offlineRequests === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-warning/10 border border-warning/30 rounded-lg p-3 shadow-lg max-w-xs z-50">
      <div className="flex items-center gap-2 mb-2">
        <CloudOff className="h-5 w-5 text-warning" />
        <h4 className="font-medium">Offline Requests</h4>
      </div>
      <p className="text-sm mb-3">
        You have {offlineRequests} emergency request{offlineRequests > 1 ? 's' : ''} saved offline.
      </p>
      {navigator.onLine ? (
        <Button 
          size="sm" 
          className="w-full" 
          onClick={handleSync} 
          disabled={isSyncing}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isSyncing ? "Syncing..." : "Sync Now"}
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          Requests will be sent automatically when you're back online.
        </p>
      )}
    </div>
  );
};

export default OfflineRequestMonitor;
