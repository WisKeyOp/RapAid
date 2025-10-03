
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, ShieldCheck, Globe, Users, Zap, Link } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Rapid Aid Connect</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Bridging the gap between disaster-affected individuals and immediate help through real-time technology and coordination.
        </p>
      </div>
      
      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <Badge variant="outline" className="mb-4">Our Mission</Badge>
          <h2 className="text-3xl font-bold mb-6">Saving Lives Through Technology</h2>
          <p className="text-gray-600 mb-6">
            Rapid Aid Connect was founded with a simple yet powerful mission: to leverage technology 
            to save lives during disasters by connecting those in need with those who can help, 
            as quickly and efficiently as possible.
          </p>
          <p className="text-gray-600 mb-6">
            In disaster situations, every minute counts. Our platform enables real-time coordination 
            between affected individuals, volunteers, NGOs, and emergency services, ensuring that help 
            reaches where it's most needed without delay.
          </p>
          <Button className="mt-2">
            Join Our Mission <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1621574539537-149595913e2d" 
            alt="Emergency Response Team" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* How It Works */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl font-bold">Our Approach to Disaster Relief</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="bg-emergency/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Zap className="text-emergency h-6 w-6" />
              </div>
              <CardTitle>Real-Time Request System</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Affected individuals can quickly submit help requests with their location, situation details, and urgency level. These requests are validated and made visible to nearby volunteers and NGOs.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="bg-info/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Globe className="text-info h-6 w-6" />
              </div>
              <CardTitle>Location-Based Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our system matches help requests with the nearest available volunteers and NGOs, ensuring the fastest possible response time. Responders can see real-time updates on their dashboards.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="bg-success/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Link className="text-success h-6 w-6" />
              </div>
              <CardTitle>Coordination & Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built-in communication tools enable seamless coordination between responders. NGOs can assign tasks to volunteers and track progress, creating an efficient response network.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16 rounded-lg mb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">750+</p>
              <p className="text-xl">Lives Saved</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">45+</p>
              <p className="text-xl">NGO Partners</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">1200+</p>
              <p className="text-xl">Active Volunteers</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">15+</p>
              <p className="text-xl">Disaster Zones</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Our Team</Badge>
          <h2 className="text-3xl font-bold">The People Behind Rapid Aid Connect</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
            A dedicated team of technologists, disaster response experts, and humanitarian workers.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              name: "Rajiv Sharma",
              role: "Founder & CEO",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
            },
            {
              name: "Priya Mehta",
              role: "CTO",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            },
            {
              name: "Arjun Kapoor",
              role: "Head of Operations",
              image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6"
            },
            {
              name: "Neha Singh",
              role: "Partnerships Lead",
              image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56"
            }
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 rounded-full overflow-hidden h-32 w-32 mx-auto">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Partners */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Our Partners</Badge>
          <h2 className="text-3xl font-bold">Working Together to Save Lives</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {[1, 2, 3, 4].map((partner) => (
            <div key={partner} className="bg-gray-100 p-8 rounded-lg w-full h-32 flex items-center justify-center">
              <p className="text-gray-500 font-medium">Partner Logo</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-muted p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Join our network of volunteers, NGOs, and responders who are making a real difference in disaster-affected communities.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-emergency hover:bg-emergency/90">
            <Heart className="mr-2 h-4 w-4" /> Help Those in Need
          </Button>
          <Button variant="outline" className="bg-info/10 border-info/50 text-info hover:bg-info/20">
            <ShieldCheck className="mr-2 h-4 w-4" /> Become a Volunteer
          </Button>
          <Button variant="outline" className="bg-success/10 border-success/50 text-success hover:bg-success/20">
            <Users className="mr-2 h-4 w-4" /> Register as an NGO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
