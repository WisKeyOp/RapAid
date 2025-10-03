
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightFromLine, Home, MapPin, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

interface RouteProps {
  id: string;
  name: string;
  status: 'clear' | 'congested' | 'blocked';
  startPoint: string;
  endPoint: string;
  distance: string;
  estimatedTime: string;
  startCoords: [number, number]; // [lng, lat]
  endCoords: [number, number]; // [lng, lat]
  pathCoordinates?: [number, number][]; // Optional path coordinates for the route
}

const routes: RouteProps[] = [
  {
    id: '1',
    name: 'Western Express Highway Route',
    status: 'congested',
    startPoint: 'Andheri East',
    endPoint: 'Borivali Relief Camp',
    distance: '15.2 km',
    estimatedTime: '45 mins',
    startCoords: [72.8575, 19.1136],
    endCoords: [72.8456, 19.2307],
    pathCoordinates: [
      [72.8575, 19.1136], 
      [72.8550, 19.1250], 
      [72.8525, 19.1400], 
      [72.8500, 19.1550], 
      [72.8475, 19.1700], 
      [72.8460, 19.1850], 
      [72.8450, 19.2000], 
      [72.8456, 19.2307]
    ]
  },
  {
    id: '2',
    name: 'Eastern Express Highway Route',
    status: 'clear',
    startPoint: 'Kurla',
    endPoint: 'Mulund Relief Camp',
    distance: '12.8 km',
    estimatedTime: '22 mins',
    startCoords: [72.8891, 19.0725],
    endCoords: [72.9582, 19.1752],
    pathCoordinates: [
      [72.8891, 19.0725], 
      [72.8950, 19.0850], 
      [72.9050, 19.1000], 
      [72.9200, 19.1200], 
      [72.9350, 19.1400], 
      [72.9450, 19.1600], 
      [72.9582, 19.1752]
    ]
  },
  {
    id: '3',
    name: 'LBS Road Route',
    status: 'blocked',
    startPoint: 'Bandra',
    endPoint: 'Vikhroli Relief Camp',
    distance: '18.4 km',
    estimatedTime: 'Unavailable',
    startCoords: [72.8296, 19.0596],
    endCoords: [72.9137, 19.1097]
  },
  {
    id: '4',
    name: 'SV Road Route',
    status: 'clear',
    startPoint: 'Dadar',
    endPoint: 'Goregaon Relief Camp',
    distance: '14.1 km',
    estimatedTime: '30 mins',
    startCoords: [72.8410, 19.0178],
    endCoords: [72.8643, 19.1624],
    pathCoordinates: [
      [72.8410, 19.0178], 
      [72.8400, 19.0350], 
      [72.8450, 19.0550], 
      [72.8500, 19.0750], 
      [72.8550, 19.0950], 
      [72.8570, 19.1150], 
      [72.8590, 19.1350], 
      [72.8643, 19.1624]
    ]
  }
];

const EvacuationRoute = ({ route, onViewRoute }: { route: RouteProps, onViewRoute: (routeId: string) => void }) => {
  const getStatusColor = () => {
    switch (route.status) {
      case 'clear':
        return 'bg-success/10 text-success';
      case 'congested':
        return 'bg-warning/10 text-warning';
      case 'blocked':
        return 'bg-destructive/10 text-destructive';
    }
  };

  const getStatusText = () => {
    switch (route.status) {
      case 'clear':
        return 'Clear';
      case 'congested':
        return 'Congested';
      case 'blocked':
        return 'Blocked';
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{route.name}</h3>
          <Badge variant="outline" className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">{route.distance}</div>
          <div className="text-sm font-medium">{route.estimatedTime}</div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{route.startPoint}</span>
        <ArrowRightFromLine className="h-4 w-4 text-muted-foreground mx-1" />
        <Home className="h-4 w-4 text-success" />
        <span className="text-sm">{route.endPoint}</span>
      </div>

      <div className="mt-4 flex justify-end">
        <Button 
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={() => onViewRoute(route.id)}
        >
          <Navigation className="mr-2 h-3 w-3" />
          View on Map
        </Button>
      </div>
    </div>
  );
};

const EvacuationRoutes = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  
  const selectedRoute = routes.find(route => route.id === selectedRouteId);
  
  const getRouteColor = (status: 'clear' | 'congested' | 'blocked') => {
    switch(status) {
      case 'clear':
        return '#10b981'; // Green for clear
      case 'congested':
        return '#eab308'; // Yellow for congested
      case 'blocked':
        return '#ef4444'; // Red for blocked
    }
  };

  const handleViewRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    setShowMap(true);
  };

  // Initialize and update map when route selection changes
  useEffect(() => {
    // Fix default icons
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    if (showMap && selectedRoute && mapRef.current) {
      // Clear existing map
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }

      // Create start and end icons
      const startIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px rgba(0,0,0,0.1);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      
      const endIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #10b981; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px rgba(0,0,0,0.1);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      // Initialize map
      leafletMapRef.current = L.map(mapRef.current);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMapRef.current);
      
      // Add markers for start and end points
      const startMarker = L.marker(
        [selectedRoute.startCoords[1], selectedRoute.startCoords[0]], 
        { icon: startIcon }
      ).addTo(leafletMapRef.current);
      
      startMarker.bindPopup(`
        <div>
          <h3 style="font-weight: bold">Starting Point</h3>
          <p>${selectedRoute.startPoint}</p>
        </div>
      `);
      
      const endMarker = L.marker(
        [selectedRoute.endCoords[1], selectedRoute.endCoords[0]], 
        { icon: endIcon }
      ).addTo(leafletMapRef.current);
      
      endMarker.bindPopup(`
        <div>
          <h3 style="font-weight: bold">Destination</h3>
          <p>${selectedRoute.endPoint}</p>
        </div>
      `);
      
      // Add polyline for route if path coordinates exist
      if (selectedRoute.pathCoordinates) {
        const routePath = selectedRoute.pathCoordinates.map(([lng, lat]) => [lat, lng]);
        L.polyline(routePath, {
          color: getRouteColor(selectedRoute.status),
          weight: 5,
          opacity: 0.8
        }).addTo(leafletMapRef.current);
      }
      
      // Create bounds to fit all route points
      const coordinates = [
        [selectedRoute.startCoords[1], selectedRoute.startCoords[0]],
        [selectedRoute.endCoords[1], selectedRoute.endCoords[0]],
        ...(selectedRoute.pathCoordinates?.map(([lng, lat]) => [lat, lng]) || [])
      ];
      
      const bounds = L.latLngBounds(coordinates);
      leafletMapRef.current.fitBounds(bounds, { padding: [50, 50] });

      return () => {
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }
      };
    }
  }, [showMap, selectedRouteId, selectedRoute]);

  const mumbaiPosition: [number, number] = [19.0760, 72.8777];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evacuation Routes</CardTitle>
        <CardDescription>
          Active evacuation routes to nearest safe zones and relief camps
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showMap && selectedRoute ? (
          <div className="mb-4">
            <div className="h-[400px] w-full relative rounded-md overflow-hidden mb-4">
              <div ref={mapRef} className="h-full w-full"></div>
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                Route: {selectedRoute.name}
              </h3>
              <Button 
                variant="outline"
                onClick={() => setShowMap(false)}
              >
                Back to List
              </Button>
            </div>
          </div>
        ) : (
          routes.map(route => (
            <EvacuationRoute 
              key={route.id} 
              route={route} 
              onViewRoute={handleViewRoute}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default EvacuationRoutes;
    