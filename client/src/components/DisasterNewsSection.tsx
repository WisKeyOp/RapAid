
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";

// Mock news data
const mockNews = {
  alerts: [
    {
      id: "alert-1",
      title: "Flood Warning: Mumbai Coastal Areas",
      source: "Indian Meteorological Department",
      time: "2 hours ago",
      severity: "high",
      link: "#"
    },
    {
      id: "alert-2",
      title: "Heavy Rainfall Expected in Western Suburbs",
      source: "NDMA",
      time: "5 hours ago",
      severity: "medium",
      link: "#"
    }
  ],
  updates: [
    {
      id: "update-1",
      title: "Relief Camps Set Up in Andheri and Bandra",
      source: "Municipal Corporation",
      time: "3 hours ago",
      link: "#"
    },
    {
      id: "update-2",
      title: "Roads Cleared in Dadar Area",
      source: "Traffic Police",
      time: "6 hours ago",
      link: "#"
    }
  ],
  resources: [
    {
      id: "resource-1",
      title: "Flood Safety Guidelines",
      source: "WHO",
      type: "guide",
      link: "#"
    },
    {
      id: "resource-2",
      title: "Emergency Contact Numbers",
      source: "Govt. of Maharashtra",
      type: "contacts",
      link: "#"
    },
    {
      id: "resource-3",
      title: "First Aid Procedures",
      source: "Red Cross",
      type: "guide",
      link: "#"
    }
  ]
};

const DisasterNewsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disaster News & Resources</CardTitle>
        <CardDescription>
          Stay informed with the latest alerts, updates, and resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="alerts">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts" className="space-y-4">
            {mockNews.alerts.map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-start justify-between border-b pb-3"
              >
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="font-medium mr-2">{alert.title}</h3>
                    {alert.severity === "high" ? (
                      <Badge className="bg-emergency">High Alert</Badge>
                    ) : (
                      <Badge className="bg-warning">Alert</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.source}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <a 
                  href={alert.link} 
                  className="text-secondary hover:text-secondary/80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="updates" className="space-y-4">
            {mockNews.updates.map((update) => (
              <div 
                key={update.id} 
                className="flex items-start justify-between border-b pb-3"
              >
                <div>
                  <h3 className="font-medium mb-1">{update.title}</h3>
                  <p className="text-sm text-muted-foreground">{update.source}</p>
                  <p className="text-xs text-muted-foreground">{update.time}</p>
                </div>
                <a 
                  href={update.link} 
                  className="text-secondary hover:text-secondary/80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="resources" className="grid md:grid-cols-2 gap-4">
            {mockNews.resources.map((resource) => (
              <a 
                key={resource.id} 
                href={resource.link} 
                className="block p-3 border rounded-md hover:bg-muted/50 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.source}</p>
                  </div>
                  <Badge variant="outline" className="bg-accent/10 text-accent">
                    {resource.type === 'guide' ? 'Guide' : 'Contacts'}
                  </Badge>
                </div>
              </a>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DisasterNewsSection;
