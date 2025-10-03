
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface ResourceDetailProps {
  id: string;
  name: string;
  category: string;
  available: number;
  total: number;
  location: string;
  lastUpdated: string;
  expiryDate?: string;
}

const ResourceDetails = () => {
  const resources: ResourceDetailProps[] = [
    {
      id: '1',
      name: 'Bottled Water',
      category: 'Essentials',
      available: 2500,
      total: 5000,
      location: 'Central Warehouse, Dadar',
      lastUpdated: '1 hour ago'
    },
    {
      id: '2',
      name: 'First Aid Kits',
      category: 'Medical',
      available: 750,
      total: 1000,
      location: 'Medical Camp, Andheri',
      lastUpdated: '3 hours ago'
    },
    {
      id: '3',
      name: 'Blankets',
      category: 'Shelter',
      available: 1200,
      total: 2000,
      location: 'Relief Camp, Borivali',
      lastUpdated: '5 hours ago'
    },
    {
      id: '4',
      name: 'Ready-to-eat Meals',
      category: 'Food',
      available: 3000,
      total: 7500,
      location: 'Food Distribution Center, Kurla',
      lastUpdated: '2 hours ago',
      expiryDate: '2 days'
    },
    {
      id: '5',
      name: 'Portable Generators',
      category: 'Equipment',
      available: 15,
      total: 25,
      location: 'Equipment Depot, Vikhroli',
      lastUpdated: '12 hours ago'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Inventory Details</CardTitle>
        <CardDescription>
          Detailed information about available resources and their locations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map(resource => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">
                  {resource.name}
                  {resource.expiryDate && (
                    <span className="text-xs text-destructive block">
                      Expires in: {resource.expiryDate}
                    </span>
                  )}
                </TableCell>
                <TableCell>{resource.category}</TableCell>
                <TableCell>
                  <div className="w-32">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{resource.available}</span>
                      <span>{resource.total}</span>
                    </div>
                    <Progress 
                      value={(resource.available / resource.total) * 100} 
                      className="h-2"
                    />
                  </div>
                </TableCell>
                <TableCell>{resource.location}</TableCell>
                <TableCell>{resource.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ResourceDetails;
