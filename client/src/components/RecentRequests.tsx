
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, MapPin, User, Phone } from "lucide-react";

// Mock data for recent requests
const mockRequests = [
  {
    id: "req-001",
    type: "medical",
    description: "Need medical assistance for elderly person with breathing difficulty",
    location: "Andheri East, Mumbai",
    urgency: "emergency",
    timestamp: "2 minutes ago",
    status: "pending"
  },
  {
    id: "req-002",
    type: "rescue",
    description: "Family trapped on rooftop due to flooding",
    location: "Kurla West, Mumbai",
    urgency: "high",
    timestamp: "15 minutes ago",
    status: "in-progress"
  },
  {
    id: "req-003",
    type: "food",
    description: "Need food and water for 5 people",
    location: "Bandra, Mumbai",
    urgency: "medium",
    timestamp: "45 minutes ago",
    status: "in-progress"
  },
];

const RecentRequests = () => {
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return <Badge className="bg-emergency animate-pulse-emergency">EMERGENCY</Badge>;
      case "high":
        return <Badge className="bg-danger">High</Badge>;
      case "medium":
        return <Badge className="bg-warning">Medium</Badge>;
      case "low":
        return <Badge className="bg-info">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-muted text-emergency">Pending</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-muted text-warning">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-muted text-success">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Help Requests</CardTitle>
        <CardDescription>
          Latest requests for assistance in your area
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[400px] pr-2">
        <div className="space-y-4">
          {mockRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="p-3 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {getUrgencyBadge(request.urgency)}
                    <span className="text-xs text-muted-foreground ml-2 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {request.timestamp}
                    </span>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-sm mb-2">{request.description}</p>
                <div className="flex items-start text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{request.location}</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Phone className="h-3 w-3 mr-1" /> Contact
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <User className="h-3 w-3 mr-1" /> Profile
                    </Button>
                  </div>
                  <Button size="sm" variant="default" className="h-7 text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" /> Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentRequests;
