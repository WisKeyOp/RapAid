
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Hero from "@/components/Hero";
import { UserRoleSelector } from "@/components/UserRoleSelector";
import EmergencyMap from "@/components/EmergencyMap";
import RecentRequests from "@/components/RecentRequests";
import DisasterNewsSection from "@/components/DisasterNewsSection";
import WeatherAlerts from "@/components/WeatherAlerts";
import EvacuationRoutes from "@/components/EvacuationRoutes";
import DisasterAlertsOptIn from "@/components/DisasterAlertsOptIn";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, Bell, MapPin } from "lucide-react";

const Index = () => {
  // In a real implementation, we would check if the user is authenticated
  const isAuthenticated = false;
  const userRole = null;

  useEffect(() => {
    document.title = "Rapid Aid Connect";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthenticated ? (
        // Landing page for non-authenticated users
        <div className="flex-1">
          <Hero />
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-center mb-8">How Rapid Aid Connect Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-emergency/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="text-emergency h-6 w-6" />
                  </div>
                  <CardTitle>Request Emergency Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    If you're affected by a disaster, quickly submit a help request with your location and needs.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Link to="/request-help" className="w-full">
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-info/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="text-info h-6 w-6" />
                  </div>
                  <CardTitle>Track Relief in Real-time</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Monitor the status of your request and see real-time locations of responding volunteers.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Link to="/about" className="w-full">
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-success/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Bell className="text-success h-6 w-6" />
                  </div>
                  <CardTitle>Stay Informed & Safe</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Receive alerts about safe zones, evacuation routes, and critical updates during emergencies.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Link to="/about" className="w-full">
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            
            {/* Add Disaster Alerts Opt-In Component */}
            <div className="mb-12">
              <DisasterAlertsOptIn />
            </div>
            
            <div className="text-center mb-12">
              <Link to="/request-help">
                <Button className="bg-emergency hover:bg-emergency/90 text-white">
                  Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Latest Weather Alerts</CardTitle>
                  <CardDescription>Stay informed about weather conditions affecting disaster areas</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  <div className="bg-emergency/10 p-3 rounded-md mb-3">
                    <h3 className="text-emergency font-medium">Heavy Rainfall Warning</h3>
                    <p className="text-sm mt-1">Very heavy rainfall expected in Mumbai and surrounding areas. Stay indoors.</p>
                  </div>
                  <div className="bg-warning/10 p-3 rounded-md">
                    <h3 className="text-warning font-medium">Wind Advisory</h3>
                    <p className="text-sm mt-1">Strong winds expected along coastal areas. Secure loose objects and take precautions.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/dashboard" className="w-full">
                    <Button variant="outline" className="w-full">View All Alerts</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Evacuation Routes</CardTitle>
                  <CardDescription>Find the safest routes to evacuation centers</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  <div className="border p-3 rounded-md mb-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Eastern Express Highway</h3>
                      <Badge variant="outline" className="bg-success/10 text-success">Clear</Badge>
                    </div>
                    <p className="text-sm mt-1">From Kurla to Mulund Relief Camp - 12.8 km</p>
                  </div>
                  <div className="border p-3 rounded-md">
                    <div className="flex justify-between">
                      <h3 className="font-medium">LBS Road Route</h3>
                      <Badge variant="outline" className="bg-destructive/10 text-destructive">Blocked</Badge>
                    </div>
                    <p className="text-sm mt-1">From Bandra to Vikhroli Relief Camp - 18.4 km</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/dashboard" className="w-full">
                    <Button variant="outline" className="w-full">View All Routes</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <div className="bg-muted py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Join Our Network</h2>
              <UserRoleSelector />
            </div>
          </div>
        </div>
      ) : (
        // Dashboard for authenticated users
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Disaster Relief Dashboard</h1>
            <div className="flex items-center space-x-2 mb-6">
              <Badge variant="outline" className="bg-info/10 text-info">Active Region: Mumbai</Badge>
              <Badge variant="outline" className="bg-emergency/10 text-emergency">Alert Level: High</Badge>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Emergency Map</span>
                      <Badge className="bg-emergency animate-pulse-emergency">LIVE</Badge>
                    </CardTitle>
                    <CardDescription>
                      View active help requests and responder locations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <EmergencyMap />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <RecentRequests />
              </div>
            </div>
            
            <div className="mt-6">
              <DisasterNewsSection />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
