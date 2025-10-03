
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Bell, BellOff, MapPin, AlertCircle, AlertTriangle } from "lucide-react";

// Mock disaster API response
interface DisasterAlert {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  description: string;
  instructions: string;
  timestamp: string;
}

const mockAlerts: DisasterAlert[] = [
  {
    id: "1",
    type: "flood",
    severity: "high",
    location: "Mumbai, Maharashtra",
    description: "Flash flooding expected in low-lying areas due to heavy rainfall",
    instructions: "Move to higher ground. Avoid flooded areas.",
    timestamp: new Date().toISOString()
  },
  {
    id: "2",
    type: "cyclone",
    severity: "critical",
    location: "Coastal Maharashtra",
    description: "Cyclone approaching western coast. Expected landfall within 24 hours.",
    instructions: "Evacuate coastal areas immediately. Seek shelter in designated centers.",
    timestamp: new Date().toISOString()
  }
];

const DisasterAlertsOptIn = () => {
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [currentAlerts, setCurrentAlerts] = useState<DisasterAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  // Check if notifications are already permitted
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setAlertsEnabled(true);
      }
    }

    // Check if location is stored in localStorage
    const storedLocation = localStorage.getItem("userLocationAllowed");
    if (storedLocation === "true") {
      setLocationPermission(true);
      getCurrentPosition();
    }
  }, []);

  // Get current position if permission is granted
  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          localStorage.setItem("userLocationAllowed", "true");
          setLocationPermission(true);
          setLoading(false);
          
          // Fetch disaster alerts for this location
          fetchDisasterAlerts(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not access your location. Please check your browser settings.");
          setLoading(false);
          setLocationPermission(false);
          localStorage.removeItem("userLocationAllowed");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support desktop notification");
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setAlertsEnabled(true);
        toast.success("Notifications enabled successfully");
        
        // If we already have the location, fetch alerts
        if (userLocation) {
          fetchDisasterAlerts(userLocation.lat, userLocation.lng);
        }
      } else {
        toast.error("Notification permission denied");
        setAlertsEnabled(false);
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to request notification permission");
    }
  };

  // Mock API call to fetch disaster alerts
  const fetchDisasterAlerts = (latitude: number, longitude: number) => {
    setLoading(true);
    
    // In a real app, this would be an API call to a government disaster alert system
    // using the user's coordinates
    setTimeout(() => {
      // For demo purposes, we're using mock data
      setCurrentAlerts(mockAlerts);
      setLoading(false);
      
      // Show a sample notification if alerts are enabled
      if (alertsEnabled && mockAlerts.length > 0) {
        const criticalAlerts = mockAlerts.filter(alert => alert.severity === "critical");
        if (criticalAlerts.length > 0) {
          showNotification(criticalAlerts[0]);
        }
      }
    }, 1500);
  };

  // Show a notification
  const showNotification = (alert: DisasterAlert) => {
    if (Notification.permission === "granted") {
      const notification = new Notification("Emergency Alert: " + alert.type.toUpperCase(), {
        body: `${alert.description}\n${alert.location}`,
        icon: "/favicon.ico"
      });
      
      notification.onclick = () => {
        window.focus();
        setShowDialog(true);
      };
    }
  };

  // Handle the allow alerts button click
  const handleAllowAlerts = () => {
    if (!locationPermission) {
      getCurrentPosition();
    }
    
    if (!alertsEnabled) {
      requestNotificationPermission();
    }
    
    // If both are already enabled, show the current alerts dialog
    if (locationPermission && alertsEnabled) {
      setShowDialog(true);
    }
  };

  // Toggle alerts on/off
  const toggleAlerts = () => {
    if (!alertsEnabled) {
      requestNotificationPermission();
    } else {
      setAlertsEnabled(false);
      toast.info("Disaster alerts disabled");
    }
  };

  // Get color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {alertsEnabled ? (
              <Bell className="h-5 w-5 text-green-500" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-500" />
            )}
            <CardTitle>Disaster Alerts</CardTitle>
          </div>
          {(locationPermission || alertsEnabled) && (
            <Switch
              checked={alertsEnabled}
              onCheckedChange={toggleAlerts}
              aria-label="Toggle alerts"
            />
          )}
        </div>
        <CardDescription>
          Receive timely alerts about disasters in your area without logging in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!locationPermission && !alertsEnabled ? (
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <p className="mb-4 text-gray-600">
                Stay safe by enabling disaster alerts for your current location. No account required.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {userLocation ? "Location access granted" : "Location access pending"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {alertsEnabled ? "Alerts enabled" : "Alerts disabled"}
                </span>
              </div>
              {currentAlerts.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Current alerts in your area:</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {currentAlerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className={`rounded-md px-3 py-2 text-sm border ${getSeverityColor(alert.severity)}`}
                      >
                        <div className="font-medium">{alert.type.toUpperCase()}</div>
                        <div className="text-xs">{alert.location}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <Button 
            onClick={handleAllowAlerts}
            className="w-full"
            variant={alertsEnabled ? "outline" : "default"}
            disabled={loading}
          >
            {loading ? (
              "Processing..."
            ) : locationPermission && alertsEnabled ? (
              "View Active Alerts"
            ) : (
              "Allow Disaster Alerts"
            )}
          </Button>
          
          {(locationPermission || alertsEnabled) && (
            <div className="mt-2 flex items-center space-x-2">
              <Checkbox 
                id="show-instructions" 
                checked={showInstructions}
                onCheckedChange={(checked) => setShowInstructions(!!checked)}
              />
              <label 
                htmlFor="show-instructions" 
                className="text-xs text-gray-500 cursor-pointer"
              >
                Show safety instructions with alerts
              </label>
            </div>
          )}
        </div>
      </CardFooter>

      {/* Dialog to show detailed alerts */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Active Disaster Alerts</DialogTitle>
            <DialogDescription>
              The following alerts are active in your area
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto">
            {currentAlerts.length > 0 ? (
              currentAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{alert.type.toUpperCase()}</h3>
                  <p className="text-sm text-gray-500 mb-2">{alert.location}</p>
                  <p className="mb-4">{alert.description}</p>
                  
                  {showInstructions && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h4 className="font-medium text-blue-800 mb-1">Safety Instructions:</h4>
                      <p className="text-sm text-blue-700">{alert.instructions}</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Issued: {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">No active alerts in your area</p>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DisasterAlertsOptIn;
