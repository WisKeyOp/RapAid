
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Mock data for the emergency requests
const mockRequests = [
  { id: 1, type: "medical", lat: 19.0760, lng: 72.8777, status: "pending", urgency: "high", name: "Medical Aid" },
  { id: 2, type: "food", lat: 19.0330, lng: 72.8296, status: "in-progress", urgency: "medium", name: "Food & Water" },
  { id: 3, type: "rescue", lat: 19.0883, lng: 72.8921, status: "pending", urgency: "emergency", name: "Rescue Team" },
  { id: 4, type: "shelter", lat: 19.1273, lng: 72.8691, status: "completed", urgency: "low", name: "Shelter Need" },
];

// Mock data for volunteer locations that will be "moving"
const mockVolunteers = [
  { id: 101, name: "Team Alpha", lat: 19.0700, lng: 72.8700, status: "active", type: "medical" },
  { id: 102, name: "Team Beta", lat: 19.0400, lng: 72.8350, status: "active", type: "rescue" },
  { id: 103, name: "Team Delta", lat: 19.0950, lng: 72.8850, status: "en-route", type: "food" },
];

const EmergencyMap = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { toast } = useToast();
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const volunteersRef = useRef([]);

  // Initialize map when component mounts
  useEffect(() => {
    // Fix default icon issue
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    // Add pulse animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.3); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
      .emergency-marker {
        animation: pulse 2s infinite;
      }
    `;
    document.head.appendChild(style);

    // Initialize the map
    if (mapRef.current && !leafletMapRef.current) {
      const mumbaiPosition = [19.0760, 72.8777]; // Mumbai coordinates
      
      leafletMapRef.current = L.map(mapRef.current).setView(mumbaiPosition, 11);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMapRef.current);

      // Add emergency request markers
      mockRequests.forEach(request => {
        const icon = createEmergencyIcon(request.urgency);
        const marker = L.marker([request.lat, request.lng], { icon })
          .addTo(leafletMapRef.current);
        
        marker.bindPopup(`
          <div>
            <h3 style="font-weight: bold">${request.name}</h3>
            <p>Status: ${request.status}</p>
            <p>Urgency: ${request.urgency}</p>
          </div>
        `);
        
        markersRef.current.push(marker);
      });

      // Add volunteer markers
      mockVolunteers.forEach(volunteer => {
        const volunteerIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #10b981; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px rgba(0,0,0,0.1);"></div>`,
          iconSize: [15, 15],
          iconAnchor: [7, 7]
        });
        
        const marker = L.marker([volunteer.lat, volunteer.lng], { icon: volunteerIcon })
          .addTo(leafletMapRef.current);
        
        marker.bindPopup(`
          <div>
            <h3 style="font-weight: bold">${volunteer.name}</h3>
            <p>Status: ${volunteer.status}</p>
            <p>Type: ${volunteer.type}</p>
          </div>
        `);
        
        volunteersRef.current.push({ marker, data: volunteer });
      });

      // Simulate volunteer movement
      const moveInterval = setInterval(() => {
        volunteersRef.current.forEach(({ marker, data }) => {
          const offset = 0.0005;
          data.lat += (Math.random() - 0.5) * offset;
          data.lng += (Math.random() - 0.5) * offset;
          marker.setLatLng([data.lat, data.lng]);
        });
      }, 2000);

      // Set map as loaded
      setIsMapLoaded(true);
      toast({
        title: "Map Loaded",
        description: "The emergency map has been loaded successfully.",
      });

      return () => {
        clearInterval(moveInterval);
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }
        document.head.removeChild(style);
      };
    }
  }, [toast]);

  // Create custom markers for emergency requests based on urgency
  const createEmergencyIcon = (urgency) => {
    let color;
    let pulseClass = '';
    
    switch (urgency) {
      case 'emergency':
        color = '#ef4444'; // Red
        pulseClass = 'emergency-marker';
        break;
      case 'high':
        color = '#f97316'; // Orange
        break;
      case 'medium':
        color = '#eab308'; // Yellow
        break;
      case 'low':
        color = '#3b82f6'; // Blue
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

  return (
    <div className="h-[500px] w-full relative rounded-md overflow-hidden">
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
          <Skeleton className="h-full w-full" />
        </div>
      )}
      
      <div ref={mapRef} className="h-full w-full"></div>

      {/* Legend (show after map is loaded) */}
      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 p-3 rounded-md shadow-md">
        <p className="text-sm font-medium mb-2">Request Types:</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Emergency</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span>Medical</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Food/Water</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Shelter</span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t">
          <p className="text-sm font-medium mb-2">Status:</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center">
              <AlertCircle className="w-3 h-3 text-red-500 mr-2" />
              <span>Pending</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 text-orange-500 mr-2" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;
