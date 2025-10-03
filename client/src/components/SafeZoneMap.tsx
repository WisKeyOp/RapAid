import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Home, ShieldCheck } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Mock data for safe zones
const mockSafeZones = [
  { id: 1, name: "City Hall Shelter", type: "shelter", capacity: "250 people", address: "123 Main St, Mumbai", lat: 19.0760, lng: 72.8600 },
  { id: 2, name: "St. Mary's School", type: "shelter", capacity: "180 people", address: "45 Education Rd, Mumbai", lat: 19.0330, lng: 72.8296 },
  { id: 3, name: "Central Hospital", type: "medical", capacity: "120 beds", address: "78 Health Ave, Mumbai", lat: 19.0883, lng: 72.8921 },
  { id: 4, name: "Municipal Building", type: "food", capacity: "400 meals/day", address: "90 Government Blvd, Mumbai", lat: 19.1273, lng: 72.8691 },
];

// Mock data for danger zones
const mockDangerZones = [
  { id: 1, name: "Flooded Underpass", type: "flood", severity: "high", address: "River Rd & Main St", lat: 19.0900, lng: 72.8700 },
  { id: 2, name: "Collapsed Building", type: "structural", severity: "high", address: "56 Construction Ave", lat: 19.0500, lng: 72.8400 },
  { id: 3, name: "Downed Power Lines", type: "electrical", severity: "medium", address: "89 Power Lane", lat: 19.1000, lng: 72.8800 },
];

const SafeZoneMap = () => {
  const [activeTab, setActiveTab] = useState<"safe" | "danger">("safe");
  const [selectedZone, setSelectedZone] = useState<{ lat: number, lng: number } | null>(null);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  const flyToZone = (lat: number, lng: number) => {
    setSelectedZone({ lat, lng });
    
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([lat, lng], 14);
    }
  };

  useEffect(() => {
    // Add pulse animation style for danger markers
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.3); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
      .danger-marker {
        animation: pulse 2s infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Create icon based on zone type
  const createSafeZoneIcon = (type: string) => {
    let color;
    switch (type) {
      case 'shelter':
        color = '#10b981'; // Green
        break;
      case 'medical':
        color = '#3b82f6'; // Blue
        break;
      case 'food':
        color = '#eab308'; // Yellow
        break;
      default:
        color = '#6b7280'; // Gray
    }
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px rgba(0,0,0,0.1);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };
  
  // Create icon based on danger zone severity
  const createDangerZoneIcon = (severity: string) => {
    let color;
    let pulseClass = '';
    
    switch (severity) {
      case 'high':
        color = '#ef4444'; // Red
        pulseClass = 'danger-marker';
        break;
      case 'medium':
        color = '#f97316'; // Orange
        break;
      default:
        color = '#6b7280'; // Gray
    }
    
    return L.divIcon({
      className: `custom-div-icon ${pulseClass}`,
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px rgba(0,0,0,0.1);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  // Initialize or update map when active tab changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Fix default icons
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    // Clear existing markers
    if (markersRef.current) {
      markersRef.current.forEach(marker => {
        if (leafletMapRef.current) {
          marker.remove();
        }
      });
      markersRef.current = [];
    }

    // Initialize the map if it doesn't exist yet
    if (!leafletMapRef.current) {
      const mumbaiPosition = [19.0760, 72.8777];
      leafletMapRef.current = L.map(mapRef.current).setView(mumbaiPosition, 11);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMapRef.current);
    }

    // Add markers based on active tab
    const zones = activeTab === 'safe' ? mockSafeZones : mockDangerZones;
    
    zones.forEach(zone => {
      const icon = activeTab === 'safe' 
        ? createSafeZoneIcon(zone.type) 
        : createDangerZoneIcon(zone.severity);
      
      const marker = L.marker([zone.lat, zone.lng], { icon })
        .addTo(leafletMapRef.current);
      
      marker.bindPopup(`
        <div>
          <h3 style="font-weight: bold">${zone.name}</h3>
          <p>Type: ${zone.type}</p>
          <p>${activeTab === 'safe' ? `Capacity: ${zone.capacity}` : `Severity: ${zone.severity}`}</p>
          <p>Address: ${zone.address}</p>
        </div>
      `);
      
      markersRef.current.push(marker);
    });

    // If there's a selected zone, fly to it
    if (selectedZone) {
      leafletMapRef.current.flyTo([selectedZone.lat, selectedZone.lng], 14);
    }

    return () => {
      // We don't remove the map here because we want to keep it between tab changes
    };
  }, [activeTab, selectedZone]);

  // Clean up the map when component unmounts
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, []);

  const mumbaiPosition: [number, number] = [19.0760, 72.8777];

  return (
    <div className="h-full w-full relative">
      <div className="flex justify-center mb-4 space-x-4">
        <Button 
          variant={activeTab === "safe" ? "default" : "outline"}
          onClick={() => setActiveTab("safe")}
          className="flex items-center"
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Safe Zones
        </Button>
        <Button 
          variant={activeTab === "danger" ? "default" : "outline"} 
          onClick={() => setActiveTab("danger")}
          className="flex items-center"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Danger Zones
        </Button>
      </div>

      <div className="h-[400px] w-full relative rounded-md overflow-hidden">
        <div ref={mapRef} className="h-full w-full"></div>
        
        {/* Map Legend */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 p-3 rounded-md shadow-md">
          <p className="text-sm font-medium mb-2">Map Legend:</p>
          <div className="space-y-1 text-xs">
            {activeTab === "safe" ? (
              <>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Shelter</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Medical Facility</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span>Food Distribution</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>High Risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Low Risk</span>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="w-full">
              <Home className="mr-2 h-3 w-3" />
              My Location
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">
          {activeTab === "safe" ? "Safe Locations" : "Danger Zones"}
        </h3>
        <div className="space-y-3">
          {activeTab === "safe" 
            ? mockSafeZones.map(zone => (
                <div key={zone.id} className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <div className="font-medium">{zone.name}</div>
                    <div className="text-sm text-muted-foreground">{zone.address}</div>
                    <div className="flex items-center mt-1 text-xs">
                      <Badge variant="outline" className="mr-2">
                        {zone.type === "shelter" ? "Shelter" : zone.type === "medical" ? "Medical" : "Food & Water"}
                      </Badge>
                      <span>{zone.capacity}</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => flyToZone(zone.lat, zone.lng)}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Directions
                  </Button>
                </div>
              ))
            : mockDangerZones.map(zone => (
                <div key={zone.id} className="p-3 border rounded-md flex justify-between items-center bg-destructive/5 border-destructive/20">
                  <div>
                    <div className="font-medium">{zone.name}</div>
                    <div className="text-sm text-muted-foreground">{zone.address}</div>
                    <div className="flex items-center mt-1 text-xs">
                      <Badge variant={zone.severity === "high" ? "destructive" : "outline"} className="mr-2">
                        {zone.severity === "high" ? "High Risk" : "Medium Risk"}
                      </Badge>
                      <span>{zone.type}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => flyToZone(zone.lat, zone.lng)}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Avoid Area
                  </Button>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default SafeZoneMap;