
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Rapid Aid Connect</h3>
            <p className="text-gray-300 mb-4">
              Connecting disaster-affected individuals with immediate help from NGOs and volunteers.
              Save lives through real-time coordination and rapid response.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-info transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-info transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-info transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/request-help" className="text-gray-300 hover:text-white transition-colors">Request Help</Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-gray-300 hover:text-white transition-colors">Volunteer</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Disaster Preparedness</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Emergency Guidelines</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Safe Zones Map</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">NGO Partners</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0 text-info" />
                <span className="text-gray-300">123 Emergency Ave, Mumbai, India</span>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0 text-info" />
                <span className="text-gray-300">Emergency: +91-1234-567890</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0 text-info" />
                <span className="text-gray-300">contact@rapidaidconnect.org</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Rapid Aid Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
