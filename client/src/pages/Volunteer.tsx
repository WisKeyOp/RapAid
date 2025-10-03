
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Heart, UserRound, Clock, Award, CheckCircle2, Upload } from "lucide-react";

// Volunteer form schema
const volunteerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  age: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 18;
  }, { message: "You must be at least 18 years old" }),
  location: z.string().min(3, { message: "Please provide your location" }),
  availability: z.array(z.string()).refine((val) => val.length > 0, {
    message: "Select at least one availability option",
  }),
  skills: z.array(z.string()).refine((val) => val.length > 0, {
    message: "Select at least one skill",
  }),
  experience: z.string().optional(),
  motivation: z.string().min(20, { message: "Please provide a bit more detail about your motivation" }),
  emergencyContact: z.string().min(10, { message: "Please provide an emergency contact number" }),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

const Volunteer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      age: "",
      location: "",
      availability: [],
      skills: [],
      experience: "",
      motivation: "",
      emergencyContact: "",
      agreeTerms: false,
    }
  });

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdProofFile(e.target.files[0]);
    }
  };
  
  const onSubmit = (data: VolunteerFormValues) => {
    setIsSubmitting(true);
    
    // In a real implementation, you'd send this data to your backend
    console.log("Form data:", data);
    console.log("ID proof file:", idProofFile);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Application submitted",
        description: "Thank you for volunteering! We'll review your application and get back to you soon.",
      });
      
      form.reset();
      setIdProofFile(null);
    }, 1500);
  };

  const availabilityOptions = [
    { id: "weekdays", label: "Weekdays" },
    { id: "weekends", label: "Weekends" },
    { id: "mornings", label: "Mornings" },
    { id: "evenings", label: "Evenings" },
    { id: "on-call", label: "On-Call (Emergency)" },
  ];

  const skillOptions = [
    { id: "first-aid", label: "First Aid" },
    { id: "medical", label: "Medical Professional" },
    { id: "driving", label: "Driving" },
    { id: "cooking", label: "Cooking" },
    { id: "counseling", label: "Counseling" },
    { id: "logistics", label: "Logistics" },
    { id: "communications", label: "Communications" },
    { id: "languages", label: "Multiple Languages" },
    { id: "tech", label: "Technical/IT" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Become a Volunteer</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our network of volunteers who make a real difference in disaster-affected communities.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Benefits Section */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader className="bg-info text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2" />
                    Why Volunteer With Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <h3 className="font-medium">Make a Real Impact</h3>
                        <p className="text-sm text-gray-500">Help save lives and provide critical support during disasters.</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <h3 className="font-medium">Flexible Commitment</h3>
                        <p className="text-sm text-gray-500">Choose when and how you want to help based on your availability.</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <h3 className="font-medium">Training Opportunities</h3>
                        <p className="text-sm text-gray-500">Receive proper training in disaster response and rescue operations.</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <h3 className="font-medium">Community Network</h3>
                        <p className="text-sm text-gray-500">Join a community of like-minded individuals committed to helping others.</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Award className="mr-2 h-5 w-5 text-info" />
                      Volunteer Recognition
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Our top volunteers are recognized for their contributions with certificates, awards, and community recognition.
                    </p>
                    
                    <h3 className="font-medium mb-2 flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-info" />
                      Time Commitment
                    </h3>
                    <p className="text-sm text-gray-500">
                      Minimum 4 hours per week or on-call for emergency situations. We appreciate any time you can give.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Application Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Volunteer Application</CardTitle>
                    <CardDescription>
                      Please fill out this form to join our volunteer network
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-info/10 text-info">
                    <UserRound className="mr-1 h-3 w-3" />
                    Verification Required
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 25" type="number" {...field} />
                              </FormControl>
                              <FormDescription>You must be at least 18 years old</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="your@email.com" type="email" {...field} />
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
                                <Input placeholder="e.g., +91 9876543210" {...field} />
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
                            <FormControl>
                              <Input placeholder="City, State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="availability"
                        render={() => (
                          <FormItem>
                            <FormLabel>Availability</FormLabel>
                            <FormDescription>
                              When are you available to volunteer?
                            </FormDescription>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                              {availabilityOptions.map((option) => (
                                <FormField
                                  key={option.id}
                                  control={form.control}
                                  name="availability"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={option.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(option.id)}
                                            onCheckedChange={(checked) => {
                                              const current = [...field.value];
                                              if (checked) {
                                                field.onChange([...current, option.id]);
                                              } else {
                                                field.onChange(
                                                  current.filter((value) => value !== option.id)
                                                );
                                              }
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                          {option.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="skills"
                        render={() => (
                          <FormItem>
                            <FormLabel>Skills & Expertise</FormLabel>
                            <FormDescription>
                              Select all skills that apply to you
                            </FormDescription>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                              {skillOptions.map((option) => (
                                <FormField
                                  key={option.id}
                                  control={form.control}
                                  name="skills"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={option.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(option.id)}
                                            onCheckedChange={(checked) => {
                                              const current = [...field.value];
                                              if (checked) {
                                                field.onChange([...current, option.id]);
                                              } else {
                                                field.onChange(
                                                  current.filter((value) => value !== option.id)
                                                );
                                              }
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                          {option.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Previous Volunteer Experience</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about any previous volunteer or disaster relief experience..." 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>Optional</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="motivation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Motivation</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Why do you want to volunteer with us?" 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="emergencyContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Phone number of a relative/friend" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <FormLabel>ID Proof (Required)</FormLabel>
                        <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
                          {idProofFile ? (
                            <div className="text-center">
                              <p className="text-sm text-gray-500">{idProofFile.name}</p>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setIdProofFile(null)}
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
                                  htmlFor="id-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-info hover:text-info/80 focus-within:outline-none"
                                >
                                  <span>Upload ID proof</span>
                                  <input
                                    id="id-upload"
                                    name="id-upload"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleIdProofChange}
                                    accept="image/*,.pdf"
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Aadhar, PAN, Voter ID, Driving License, or Passport
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="agreeTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Terms and Conditions</FormLabel>
                              <FormDescription>
                                I agree to the volunteer terms, code of conduct, and privacy policy. I understand that my information will be verified.
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-info hover:bg-info/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting Application..." : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
