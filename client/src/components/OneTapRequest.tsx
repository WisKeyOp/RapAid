import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Ambulance, MapPin, Apple, Pill } from "lucide-react";

type EmergencyType = "rescue" | "food" | "medical";

interface EmergencyRequest {
  type: EmergencyType;
  location: GeolocationCoordinates | null;
  timestamp: Date;
  deviceId: string; // This would be a browser fingerprint or device ID in a real app
}

const OneTapRequest = () => {
  const [isProcessing, setIsProcessing] = useState<EmergencyType | null>(null);
  
  // Generate a simple device ID (in a real app, this would be more sophisticated)
  const getDeviceId = (): string => {
    let deviceId = localStorage.getItem("emergency-device-id");
    if (!deviceId) {
      deviceId = `device-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("emergency-device-id", deviceId);
    }
    return deviceId;
  };
  
  const handleEmergencyRequest = (type: EmergencyType) => {
    setIsProcessing(type);
    
    // Check if online
    const isOnline = navigator.onLine;
    
    // Get location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Create request object
          const request: EmergencyRequest = {
            type,
            location: position.coords,
            timestamp: new Date(),
            deviceId: getDeviceId()
          };
          
          // In a real app, we'd send this to a server or store offline
          console.log("Emergency request created:", request);
          
          if (isOnline) {
            // Simulate sending to server
            setTimeout(() => {
              setIsProcessing(null);
              toast({
                title: "Help request sent!",
                description: `Your ${type} request has been received. Help is on the way.`,
                variant: "default",
              });
            }, 1500);
          } else {
            // Store for offline sync
            const offlineRequests = JSON.parse(localStorage.getItem("offline-emergency-requests") || "[]");
            offlineRequests.push(request);
            localStorage.setItem("offline-emergency-requests", JSON.stringify(offlineRequests));
            
            setIsProcessing(null);
            toast({
              title: "Request saved offline",
              description: "We'll send your request as soon as you're back online.",
              variant: "default",
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsProcessing(null);
          toast({
            title: "Location error",
            description: "Unable to get your location. Please try again or provide location manually.",
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setIsProcessing(null);
      toast({
        title: "Location services not available",
        description: "Your device doesn't support location services. Please use the detailed form instead.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-center text-white">One-Tap Emergency Help</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          className="py-6 px-4 bg-emergency hover:bg-emergency/90 text-white flex flex-col items-center justify-center h-auto"
          disabled={isProcessing !== null}
          onClick={() => handleEmergencyRequest("rescue")}
        >
          <Ambulance className="h-8 w-8 mb-2" />
          <span className="text-lg font-bold">🆘 Need Rescue</span>
          {isProcessing === "rescue" && <span className="text-xs mt-1">Getting location...</span>}
        </Button>
        
        <Button 
          className="py-6 px-4 bg-warning hover:bg-warning/90 text-white flex flex-col items-center justify-center h-auto"
          disabled={isProcessing !== null}
          onClick={() => handleEmergencyRequest("food")}
        >
          <Apple className="h-8 w-8 mb-2" />
          <span className="text-lg font-bold">🧃 Need Food</span>
          {isProcessing === "food" && <span className="text-xs mt-1">Getting location...</span>}
        </Button>
        
        <Button 
          className="py-6 px-4 bg-info hover:bg-info/90 text-white flex flex-col items-center justify-center h-auto"
          disabled={isProcessing !== null}
          onClick={() => handleEmergencyRequest("medical")}
        >
          <Pill className="h-8 w-8 mb-2" />
          <span className="text-lg font-bold">💊 Medical Emergency</span>
          {isProcessing === "medical" && <span className="text-xs mt-1">Getting location...</span>}
        </Button>
      </div>
      
      <p className="text-center text-white/70 text-sm">
        <MapPin className="inline h-4 w-4 mr-1" />
        Tapping a button will automatically send your location
      </p>
    </div>
  );
};

export default OneTapRequest;
