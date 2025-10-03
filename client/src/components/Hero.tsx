import { Button } from "@/components/ui/button";
import { ArrowRight, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import OneTapRequest from "@/components/OneTapRequest";
import OfflineEmergencyOptions from "@/components/OfflineEmergencyOptions";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Rapid Aid Connect
          </h1>
          <p className="text-xl mb-8 text-gray-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Connecting disaster-affected individuals with immediate help from NGOs and volunteers. 
            Save lives through real-time coordination and rapid response.
          </p>
          
          {/* One-Tap Request System */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <OneTapRequest />
          </div>
          
          {/* Offline Emergency Options */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <OfflineEmergencyOptions />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="bg-emergency hover:bg-emergency/90 text-white">
              I Need Help
            </Button>
            <Button size="lg" variant="outline" className="bg-info/10 border-info/50 text-white hover:bg-info/20">
              I Want To Help <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <Link to="/#alerts" className="inline-flex items-center text-sm text-white/80 hover:text-white transition">
              <Bell className="h-4 w-4 mr-1 animate-pulse" />
              <span className="underline">Enable disaster alerts without login</span>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">750+</p>
              <p className="text-sm text-gray-300">Lives Saved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">45+</p>
              <p className="text-sm text-gray-300">NGOs Connected</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">1200+</p>
              <p className="text-sm text-gray-300">Volunteers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">15+</p>
              <p className="text-sm text-gray-300">Disaster Zones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;