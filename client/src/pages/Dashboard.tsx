
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmergencyMap from "@/components/EmergencyMap";
import ActiveVolunteers from "@/components/ActiveVolunteers";
import SafeZoneMap from "@/components/SafeZoneMap";
import TaskManagement from "@/components/TaskManagement";
import ResourceInventory from "@/components/ResourceInventory";
import WeatherAlerts from "@/components/WeatherAlerts";
import EvacuationRoutes from "@/components/EvacuationRoutes";
import { AlertCircle, Map, Users, Home, Calendar, PackageCheck, Bell, CloudRain, Route } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("emergency-map");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Disaster Response Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and coordinate relief efforts in real-time</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <div className="bg-destructive/20 text-destructive rounded-md px-3 py-1 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Active Emergency: Mumbai Floods</span>
          </div>
          <div className="bg-warning/20 text-warning rounded-md px-3 py-1 text-sm flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>45 Volunteers Active</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="emergency-map" className="flex items-center">
              <Map className="h-4 w-4 mr-2" /> Emergency Map
            </TabsTrigger>
            <TabsTrigger value="task-management" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> Task Management
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center">
              <PackageCheck className="h-4 w-4 mr-2" /> Resources
            </TabsTrigger>
            <TabsTrigger value="volunteers" className="flex items-center">
              <Users className="h-4 w-4 mr-2" /> Active Volunteers
            </TabsTrigger>
            <TabsTrigger value="safe-zones" className="flex items-center">
              <Home className="h-4 w-4 mr-2" /> Safe Zones
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" /> Alerts
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center">
              <CloudRain className="h-4 w-4 mr-2" /> Weather
            </TabsTrigger>
            <TabsTrigger value="evacuation" className="flex items-center">
              <Route className="h-4 w-4 mr-2" /> Evacuation
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="emergency-map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Response Map</CardTitle>
              <CardDescription>
                View active help requests, volunteer locations, and disaster affected areas in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <EmergencyMap />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="task-management" className="space-y-4">
          <TaskManagement />
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <ResourceInventory />
        </TabsContent>
        
        <TabsContent value="volunteers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Volunteers</CardTitle>
              <CardDescription>
                Track and manage volunteers currently deployed in the field
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ActiveVolunteers />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="safe-zones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safe Zones & Evacuation Routes</CardTitle>
              <CardDescription>
                View designated safe zones, relief camps, and evacuation routes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <SafeZoneMap />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Disaster Alerts</CardTitle>
              <CardDescription>
                Real-time alerts from government agencies and emergency services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 bg-destructive/10 p-4 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-destructive">Flood Warning: Mumbai</h3>
                    <p className="text-sm text-muted-foreground">
                      Heavy rainfall continuing for next 24 hours. Expect water logging in low-lying areas.
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <span>Source: Indian Meteorological Department (IMD)</span>
                      <span className="mx-2">•</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 bg-warning/10 p-4 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-warning">Traffic Advisory</h3>
                    <p className="text-sm text-muted-foreground">
                      Western Express Highway blocked between Andheri and Borivali due to waterlogging. Use alternate routes.
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <span>Source: Mumbai Traffic Police</span>
                      <span className="mx-2">•</span>
                      <span>4 hours ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 bg-info/10 p-4 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-info flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-info">Relief Camp Update</h3>
                    <p className="text-sm text-muted-foreground">
                      New relief camp established at Municipal School, Dadar. Capacity for 200 people. Medical facilities available.
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <span>Source: Municipal Corporation of Greater Mumbai</span>
                      <span className="mx-2">•</span>
                      <span>8 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <WeatherAlerts />
        </TabsContent>

        <TabsContent value="evacuation" className="space-y-4">
          <EvacuationRoutes />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
