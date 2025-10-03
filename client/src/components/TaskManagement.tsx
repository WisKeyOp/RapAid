
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  ShieldAlert,
  MapPin,
  Users,
  Timer
} from "lucide-react";

// Mock data for tasks
const MOCK_TASKS = [
  {
    id: "task-1",
    requestType: "rescue",
    location: "Borivali East, Mumbai",
    peopleCount: 3,
    urgencyLevel: "emergency",
    requesterName: "Amit Sharma",
    status: "pending",
    createdAt: "2023-04-03T10:30:00Z",
  },
  {
    id: "task-2",
    requestType: "medical",
    location: "Andheri West, Mumbai",
    peopleCount: 1,
    urgencyLevel: "high",
    requesterName: "Priya Patel",
    status: "in-progress",
    assignedTo: "Dr. Mehta",
    createdAt: "2023-04-03T09:15:00Z",
  },
  {
    id: "task-3",
    requestType: "food",
    location: "Dadar, Mumbai",
    peopleCount: 12,
    urgencyLevel: "medium",
    requesterName: "Raj Malhotra",
    status: "completed",
    assignedTo: "Food Relief Team",
    createdAt: "2023-04-02T14:45:00Z",
  },
  {
    id: "task-4",
    requestType: "shelter",
    location: "Kurla, Mumbai",
    peopleCount: 8,
    urgencyLevel: "high",
    requesterName: "Sunita Shah",
    status: "pending",
    createdAt: "2023-04-03T11:20:00Z",
  },
  {
    id: "task-5",
    requestType: "rescue",
    location: "Bandra, Mumbai",
    peopleCount: 2,
    urgencyLevel: "emergency",
    requesterName: "John Mathews",
    status: "in-progress",
    assignedTo: "Rescue Team Alpha",
    createdAt: "2023-04-03T08:50:00Z",
  }
];

type Task = typeof MOCK_TASKS[0];

const TaskManagement = () => {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-warning" />;
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-info" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-info" />;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return (
          <Badge variant="outline" className="bg-emergency/10 text-emergency border-emergency/30">
            Emergency
          </Badge>
        );
      case "high":
        return (
          <Badge variant="outline" className="bg-danger/10 text-danger border-danger/30">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="bg-info/10 text-info border-info/30">
            Low
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case "rescue":
        return (
          <Badge className="bg-emergency">
            <ShieldAlert className="h-3 w-3 mr-1" />
            Rescue
          </Badge>
        );
      case "medical":
        return (
          <Badge className="bg-danger">
            Medical
          </Badge>
        );
      case "food":
        return (
          <Badge className="bg-success">
            Food & Water
          </Badge>
        );
      case "shelter":
        return (
          <Badge className="bg-info">
            Shelter
          </Badge>
        );
      default:
        return <Badge>Other</Badge>;
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
    toast({
      title: "Task Updated",
      description: `Task status changed to ${newStatus}`,
    });
  };

  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter(task => task.status === filter);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Task Management</CardTitle>
        <CardDescription>
          Manage and track help requests and their status. Assign tasks to volunteers or mark them as complete.
        </CardDescription>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Filter:</span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            Assign New Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Active help requests that need attention</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  {getRequestTypeBadge(task.requestType)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{task.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{task.requesterName}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{task.peopleCount} people</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getUrgencyBadge(task.urgencyLevel)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(task.status)}
                    <span className="capitalize">{task.status.replace("-", " ")}</span>
                  </div>
                  {task.assignedTo && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Assigned to: {task.assignedTo}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{formatDate(task.createdAt)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {task.status === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => updateTaskStatus(task.id, "in-progress")}
                        >
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-destructive text-destructive"
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                    {task.status === "in-progress" && (
                      <Button 
                        size="sm"
                        onClick={() => updateTaskStatus(task.id, "completed")}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Complete
                      </Button>
                    )}
                    {task.status === "completed" && (
                      <Button size="sm" variant="outline" disabled>
                        Completed
                      </Button>
                    )}
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

export default TaskManagement;
