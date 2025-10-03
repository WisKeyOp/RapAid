
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRound, Users, Building2, ShieldCheck } from "lucide-react";

type UserRole = 'affected' | 'volunteer' | 'ngo' | 'admin' | null;

export function UserRoleSelector() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <RoleCard
        title="Affected Person"
        description="Request help for rescue, food, medical aid, or shelter"
        icon={<UserRound className="h-8 w-8" />}
        selected={selectedRole === 'affected'}
        onClick={() => handleRoleSelect('affected')}
        color="emergency"
      />
      
      <RoleCard
        title="Volunteer"
        description="Offer your time and skills to help those in need"
        icon={<Users className="h-8 w-8" />}
        selected={selectedRole === 'volunteer'}
        onClick={() => handleRoleSelect('volunteer')}
        color="info"
      />
      
      <RoleCard
        title="NGO"
        description="Coordinate large-scale relief operations with volunteers"
        icon={<Building2 className="h-8 w-8" />}
        selected={selectedRole === 'ngo'}
        onClick={() => handleRoleSelect('ngo')}
        color="success"
      />
      
      <RoleCard
        title="Admin"
        description="Manage the system, approve NGOs and volunteers"
        icon={<ShieldCheck className="h-8 w-8" />}
        selected={selectedRole === 'admin'}
        onClick={() => handleRoleSelect('admin')}
        color="warning"
      />
    </div>
  );
}

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  color: string;
}

function RoleCard({ title, description, icon, selected, onClick, color }: RoleCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        selected 
          ? `border-2 border-${color} shadow-lg` 
          : 'hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <div className={`bg-${color}/10 w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
          <div className={`text-${color}`}>
            {icon}
          </div>
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button 
          variant={selected ? "default" : "outline"} 
          className={selected ? `bg-${color} hover:bg-${color}/90` : ""}
          size="sm"
        >
          {selected ? 'Selected' : 'Select Role'}
        </Button>
      </CardFooter>
    </Card>
  );
}
