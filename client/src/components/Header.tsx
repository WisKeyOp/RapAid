
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">Rapid Aid Connect</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-blue-800"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 hover:bg-blue-800 rounded-md transition-colors">Home</Link>
            <Link to="/request-help" className="px-3 py-2 hover:bg-blue-800 rounded-md transition-colors">Request Help</Link>
            <Link to="/volunteer" className="px-3 py-2 hover:bg-blue-800 rounded-md transition-colors">Volunteer</Link>
            <Link to="/about" className="px-3 py-2 hover:bg-blue-800 rounded-md transition-colors">About</Link>
            <Link to="/dashboard" className="px-3 py-2 hover:bg-blue-800 rounded-md transition-colors flex items-center">
              <LayoutDashboard className="mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link to="/login">
              <Button variant="outline" className="bg-info/10 border-info/50 text-white hover:bg-info/20">
                Login
              </Button>
            </Link>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 py-2 bg-blue-900/95 rounded-md shadow-lg animate-fade-in">
            <Link to="/" className="block px-4 py-2 hover:bg-blue-800" onClick={toggleMenu}>Home</Link>
            <Link to="/request-help" className="block px-4 py-2 hover:bg-blue-800" onClick={toggleMenu}>Request Help</Link>
            <Link to="/volunteer" className="block px-4 py-2 hover:bg-blue-800" onClick={toggleMenu}>Volunteer</Link>
            <Link to="/about" className="block px-4 py-2 hover:bg-blue-800" onClick={toggleMenu}>About</Link>
            <Link to="/dashboard" className="block px-4 py-2 hover:bg-blue-800 flex items-center" onClick={toggleMenu}>
              <LayoutDashboard className="mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link to="/login" className="block px-4 py-2 hover:bg-blue-800" onClick={toggleMenu}>Login</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
