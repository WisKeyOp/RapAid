
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, CloudSnow, Sun, Thermometer, Wind } from "lucide-react";

interface WeatherAlertProps {
  type: 'rain' | 'snow' | 'heat' | 'wind' | 'sunny';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  location: string;
  description: string;
  source: string;
  time: string;
}

const WeatherAlert = ({ type, severity, location, description, source, time }: WeatherAlertProps) => {
  const getIcon = () => {
    switch (type) {
      case 'rain':
        return <CloudRain className="h-6 w-6" />;
      case 'snow':
        return <CloudSnow className="h-6 w-6" />;
      case 'heat':
        return <Thermometer className="h-6 w-6" />;
      case 'wind':
        return <Wind className="h-6 w-6" />;
      case 'sunny':
        return <Sun className="h-6 w-6" />;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'low':
        return 'bg-info/10 text-info';
      case 'medium':
        return 'bg-warning/10 text-warning';
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'extreme':
        return 'bg-emergency/10 text-emergency';
    }
  };

  return (
    <div className={`${getSeverityColor()} p-4 rounded-lg mb-4`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium">{location}</h3>
            <Badge variant="outline" className={getSeverityColor()}>
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Badge>
          </div>
          <p className="text-sm mt-1">{description}</p>
          <div className="flex items-center text-xs mt-2 text-muted-foreground">
            <span>Source: {source}</span>
            <span className="mx-2">•</span>
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeatherAlerts = () => {
  const alerts = [
    {
      type: 'rain' as const,
      severity: 'extreme' as const,
      location: 'Mumbai, Maharashtra',
      description: 'Heavy rainfall expected to continue for next 48 hours. Risk of flooding in low-lying areas.',
      source: 'Indian Meteorological Department',
      time: '30 minutes ago'
    },
    {
      type: 'wind' as const,
      severity: 'high' as const,
      location: 'Coastal Maharashtra',
      description: 'Strong winds up to 70 km/h expected along the coast. Fishermen advised not to venture into sea.',
      source: 'Disaster Management Authority',
      time: '2 hours ago'
    },
    {
      type: 'heat' as const,
      severity: 'medium' as const,
      location: 'Vidarbha Region',
      description: 'Heat wave conditions in isolated pockets. Maximum temperatures may reach 42°C.',
      source: 'Regional Weather Center',
      time: '5 hours ago'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Alerts</CardTitle>
        <CardDescription>
          Current weather alerts and warnings affecting disaster response
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.map((alert, index) => (
          <WeatherAlert 
            key={index}
            type={alert.type}
            severity={alert.severity}
            location={alert.location}
            description={alert.description}
            source={alert.source}
            time={alert.time}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default WeatherAlerts;
