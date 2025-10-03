
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneCall, MessageSquare, MapPin } from "lucide-react";

// Mock data for volunteers
const mockVolunteers = [
  {
    id: 1,
    name: "Dr. Priya Singh",
    role: "Medical Volunteer",
    avatar: "/placeholder.svg",
    status: "active",
    location: "Andheri East, Mumbai",
    specialty: "First Aid, Medical Professional",
    rating: 4.8,
    completedMissions: 12
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Rescue Volunteer",
    avatar: "/placeholder.svg",
    status: "active",
    location: "Dadar, Mumbai",
    specialty: "Search & Rescue, Driving",
    rating: 4.6,
    completedMissions: 8
  },
  {
    id: 3,
    name: "Manisha Patel",
    role: "NGO Coordinator",
    avatar: "/placeholder.svg",
    status: "active",
    location: "Bandra West, Mumbai",
    specialty: "Logistics, Communications",
    rating: 4.9,
    completedMissions: 23
  },
  {
    id: 4,
    name: "Vikram Joshi",
    role: "Rescue Volunteer",
    avatar: "/placeholder.svg",
    status: "busy",
    location: "Goregaon, Mumbai",
    specialty: "Multiple Languages, Driving",
    rating: 4.7,
    completedMissions: 15
  },
  {
    id: 5,
    name: "Aisha Khan",
    role: "Food Distribution",
    avatar: "/placeholder.svg",
    status: "active",
    location: "Malad, Mumbai",
    specialty: "Cooking, Logistics",
    rating: 4.5,
    completedMissions: 9
  }
];

// Mock data for NGOs
const mockNGOs = [
  {
    id: 1,
    name: "Mumbai Relief Foundation",
    role: "Disaster Relief",
    avatar: "/placeholder.svg",
    status: "active",
    location: "Multiple locations in Mumbai",
    specialty: "Food, Shelter, Medical",
    rating: 4.9,
    activeVolunteers: 24
  },
  {
    id: 2,
    name: "Help & Hope NGO",
    role: "Medical Support",
    avatar: "/placeholder.svg",
    status: "active",
    location: "Parel, Mumbai",
    specialty: "Medical Aid, Counseling",
    rating: 4.8,
    activeVolunteers: 18
  },
  {
    id: 3,
    name: "Rescue India",
    role: "Rescue Operations",
    avatar: "/placeholder.svg",
    status: "active",
    location: "Khar, Mumbai",
    specialty: "Search & Rescue, Equipment",
    rating: 4.7,
    activeVolunteers: 32
  }
];

const ActiveVolunteers = () => {
  const [view, setView] = useState<"volunteers" | "ngos">("volunteers");

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Responders</CardTitle>
              <CardDescription>Currently active volunteers and NGOs in the field</CardDescription>
            </div>
            <Tabs value={view} onValueChange={(v) => setView(v as "volunteers" | "ngos")}>
              <TabsList>
                <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
                <TabsTrigger value="ngos">NGOs</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="volunteers" className="m-0">
            <div className="space-y-4">
              {mockVolunteers.map((volunteer) => (
                <div key={volunteer.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={volunteer.avatar} alt={volunteer.name} />
                      <AvatarFallback>{volunteer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center">
                        {volunteer.name}
                        {volunteer.status === "active" ? (
                          <span className="ml-2 h-2 w-2 rounded-full bg-success"></span>
                        ) : (
                          <span className="ml-2 h-2 w-2 rounded-full bg-warning"></span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{volunteer.role}</div>
                      <div className="text-xs flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {volunteer.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="outline" className="mb-2">
                      {volunteer.completedMissions} Missions
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="outline">
                        <PhoneCall className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ngos" className="m-0">
            <div className="space-y-4">
              {mockNGOs.map((ngo) => (
                <div key={ngo.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={ngo.avatar} alt={ngo.name} />
                      <AvatarFallback>{ngo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center">
                        {ngo.name}
                        <span className="ml-2 h-2 w-2 rounded-full bg-success"></span>
                      </div>
                      <div className="text-sm text-muted-foreground">{ngo.role}</div>
                      <div className="text-xs flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {ngo.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="outline" className="mb-2">
                      {ngo.activeVolunteers} Volunteers
                    </Badge>
                    <Button size="sm" variant="outline">
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveVolunteers;
