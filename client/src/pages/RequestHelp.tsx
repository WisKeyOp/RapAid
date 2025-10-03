
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Upload, AlertCircle } from "lucide-react";

// Define the form schema with Zod
const helpRequestSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  location: z.string().min(5, { message: "Please provide a detailed location" }),
  requestType: z.enum(["rescue", "medical", "food", "shelter", "other"]),
  urgencyLevel: z.enum(["emergency", "high", "medium", "low"]),
  peopleCount: z.string(), // Keep as string in the schema
  description: z.string().min(10, { message: "Please provide more details about your situation" })
});

type HelpRequestFormValues = z.infer<typeof helpRequestSchema>;

const RequestHelp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const form = useForm<HelpRequestFormValues>({
    resolver: zodResolver(helpRequestSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      requestType: "rescue",
      urgencyLevel: "high",
      peopleCount: "1", // This stays as string in the form
      description: ""
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const onSubmit = (data: HelpRequestFormValues) => {
    setIsSubmitting(true);
    
    // In a real implementation, you'd send this data to your backend
    console.log("Form data:", data);
    console.log("Image file:", imageFile);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Help request submitted",
        description: "Your request has been received. Help is on the way!",
        variant: "default"
      });
      
      form.reset();
      setImageFile(null);
    }, 1500);
  };
  
  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue('location', `Lat: ${latitude}, Lng: ${longitude}`);
          toast({
            title: "Location detected",
            description: "We've captured your GPS coordinates",
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location error",
            description: "Unable to get your location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services. Please enter your location manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-emergency/90 to-emergency/70 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle />
            <CardTitle>Emergency Help Request</CardTitle>
          </div>
          <CardDescription className="text-white/90">
            Fill out this form to request immediate assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Location</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input placeholder="Detailed address or coordinates" {...field} />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleGetLocation}
                        className="flex-shrink-0 bg-info/10 hover:bg-info/20 text-info border-info/30"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Get GPS
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="requestType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select request type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rescue">Rescue</SelectItem>
                          <SelectItem value="medical">Medical Aid</SelectItem>
                          <SelectItem value="food">Food & Water</SelectItem>
                          <SelectItem value="shelter">Shelter</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="urgencyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Level</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value} 
                          className="flex space-x-2"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="emergency" id="emergency" className="text-emergency" />
                            <label htmlFor="emergency" className="text-sm font-medium">Emergency</label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="high" id="high" className="text-danger" />
                            <label htmlFor="high" className="text-sm font-medium">High</label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="medium" id="medium" className="text-warning" />
                            <label htmlFor="medium" className="text-sm font-medium">Medium</label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="low" id="low" className="text-info" />
                            <label htmlFor="low" className="text-sm font-medium">Low</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="peopleCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of People Needing Help</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of people" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((num) => (
                          <SelectItem key={num} value={num}>{num}</SelectItem>
                        ))}
                        <SelectItem value="11+">More than 10</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Situation Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide details about your situation..." 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Upload Photo/Video (Optional)</FormLabel>
                <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
                  {imageFile ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{imageFile.name}</p>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => setImageFile(null)}
                        className="mt-2 text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-info hover:text-info/80 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleImageChange}
                            accept="image/*,video/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-emergency hover:bg-emergency/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Help Request"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestHelp;
