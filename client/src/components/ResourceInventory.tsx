
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, AlertCircle } from "lucide-react";

type Resource = {
  id: string;
  name: string;
  category: "food" | "medical" | "shelter" | "clothing" | "other";
  quantity: number;
  unit: string;
  location: string;
  status: "available" | "low" | "critical";
};

const MOCK_RESOURCES: Resource[] = [
  {
    id: "res-001",
    name: "Bottled Water",
    category: "food",
    quantity: 500,
    unit: "bottles",
    location: "Central Warehouse, Mumbai",
    status: "available",
  },
  {
    id: "res-002",
    name: "First Aid Kits",
    category: "medical",
    quantity: 50,
    unit: "kits",
    location: "Medical Center, Mumbai",
    status: "available",
  },
  {
    id: "res-003",
    name: "Blankets",
    category: "shelter",
    quantity: 120,
    unit: "pieces",
    location: "Relief Center, Dadar",
    status: "available",
  },
  {
    id: "res-004",
    name: "Rice",
    category: "food",
    quantity: 200,
    unit: "kg",
    location: "Food Distribution Center, Andheri",
    status: "low",
  },
  {
    id: "res-005",
    name: "Medicine - Paracetamol",
    category: "medical",
    quantity: 20,
    unit: "boxes",
    location: "Medical Center, Mumbai",
    status: "critical",
  },
  {
    id: "res-006",
    name: "Tents",
    category: "shelter",
    quantity: 30,
    unit: "pieces",
    location: "Relief Center, Dadar",
    status: "low",
  },
  {
    id: "res-007",
    name: "Children's Clothing",
    category: "clothing",
    quantity: 100,
    unit: "sets",
    location: "Donation Center, Bandra",
    status: "available",
  },
];

const ResourceInventory = () => {
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [newResource, setNewResource] = useState({
    name: "",
    category: "food" as Resource["category"],
    quantity: 0,
    unit: "",
    location: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const getCategoryBadge = (category: Resource["category"]) => {
    const colors = {
      food: "bg-success/10 text-success border-success/30",
      medical: "bg-danger/10 text-danger border-danger/30",
      shelter: "bg-info/10 text-info border-info/30",
      clothing: "bg-warning/10 text-warning border-warning/30",
      other: "bg-gray-200 text-gray-800",
    };

    return (
      <Badge variant="outline" className={colors[category]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: Resource["status"]) => {
    const colors = {
      available: "bg-success text-white",
      low: "bg-warning text-white",
      critical: "bg-destructive text-white",
    };

    return (
      <Badge className={colors[status]}>
        {status === "critical" && <AlertCircle className="h-3 w-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const addResource = () => {
    const id = `res-${Math.random().toString(36).substring(2, 8)}`;
    const status: Resource["status"] = 
      newResource.quantity > 100 ? "available" : 
      newResource.quantity > 30 ? "low" : "critical";
    
    const resource: Resource = {
      ...newResource,
      id,
      status,
    };
    
    setResources([...resources, resource]);
    setNewResource({
      name: "",
      category: "food" as Resource["category"],
      quantity: 0,
      unit: "",
      location: "",
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Resource Added",
      description: `${resource.name} has been added to inventory`,
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setResources(
      resources.map((resource) => {
        if (resource.id === id) {
          const newQuantity = Math.max(0, resource.quantity + change);
          let newStatus: Resource["status"] = resource.status;
          
          if (newQuantity > 100) newStatus = "available";
          else if (newQuantity > 30) newStatus = "low";
          else newStatus = "critical";
          
          return { ...resource, quantity: newQuantity, status: newStatus };
        }
        return resource;
      })
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Package className="h-6 w-6" /> Resource Inventory
        </CardTitle>
        <CardDescription>
          Manage and track available resources for relief operations
        </CardDescription>
        <div className="flex justify-between items-center">
          <div>
            <Badge variant="outline" className="mr-2 bg-success/10 text-success border-success/30">
              Available: {resources.filter((r) => r.status === "available").length}
            </Badge>
            <Badge variant="outline" className="mr-2 bg-warning/10 text-warning border-warning/30">
              Low Stock: {resources.filter((r) => r.status === "low").length}
            </Badge>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
              Critical: {resources.filter((r) => r.status === "critical").length}
            </Badge>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" /> Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>
                  Add a new resource to the inventory. Fill out all fields to continue.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name">Resource Name</Label>
                  <Input
                    id="name"
                    value={newResource.name}
                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                    className="mt-1"
                    placeholder="e.g., Bottled Water, First Aid Kits"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={newResource.category}
                      onChange={(e) => setNewResource({ ...newResource, category: e.target.value as Resource["category"] })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    >
                      <option value="food">Food & Water</option>
                      <option value="medical">Medical</option>
                      <option value="shelter">Shelter</option>
                      <option value="clothing">Clothing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="flex mt-1">
                      <Input
                        id="quantity"
                        type="number"
                        value={newResource.quantity.toString()}
                        onChange={(e) => setNewResource({ ...newResource, quantity: parseInt(e.target.value) || 0 })}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unit">Unit of Measure</Label>
                    <Input
                      id="unit"
                      value={newResource.unit}
                      onChange={(e) => setNewResource({ ...newResource, unit: e.target.value })}
                      className="mt-1"
                      placeholder="e.g., boxes, kg, pieces"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newResource.location}
                      onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
                      className="mt-1"
                      placeholder="Where it's stored"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addResource} disabled={!newResource.name || !newResource.unit || !newResource.location || newResource.quantity <= 0}>
                  Add Resource
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Current inventory of emergency resources</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">{resource.name}</TableCell>
                <TableCell>{getCategoryBadge(resource.category)}</TableCell>
                <TableCell>{resource.quantity} {resource.unit}</TableCell>
                <TableCell>{resource.location}</TableCell>
                <TableCell>{getStatusBadge(resource.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(resource.id, -10)}>
                      -10
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(resource.id, 10)}>
                      +10
                    </Button>
                    <Button size="sm">Use</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ResourceInventory;
