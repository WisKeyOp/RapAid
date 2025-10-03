
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NotificationProps {
  id: string;
  type: 'alert' | 'update' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NotificationItem = ({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: NotificationProps, 
  onMarkAsRead: (id: string) => void 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'update':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'info':
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  const getBgColor = () => {
    if (notification.read) return "bg-background";
    
    switch (notification.type) {
      case 'alert':
        return "bg-destructive/5";
      case 'update':
        return "bg-success/5";
      case 'info':
        return "bg-info/5";
    }
  };

  return (
    <div className={`${getBgColor()} p-4 rounded-md mb-3 relative`}>
      <div className="flex">
        <div className="mr-3 mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm">{notification.title}</h4>
            <span className="text-xs text-muted-foreground">{notification.time}</span>
          </div>
          <p className="text-sm mt-1">{notification.message}</p>
        </div>
      </div>
      {!notification.read && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-2 right-2 h-6 w-6 p-0" 
          onClick={() => onMarkAsRead(notification.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<NotificationProps[]>([
    {
      id: '1',
      type: 'alert',
      title: 'New Flood Warning',
      message: 'Water level rising in Mithi River. Areas around Kurla and Saki Naka at risk.',
      time: '10 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'update',
      title: 'Relief Camp Opened',
      message: 'New relief camp operational at Municipal School, Ghatkopar with capacity for 200 people.',
      time: '45 minutes ago',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Road Closure Alert',
      message: 'Andheri subway closed due to waterlogging. Use alternate routes via Western Express Highway.',
      time: '1 hour ago',
      read: true
    },
    {
      id: '4',
      type: 'update',
      title: 'Medical Teams Dispatched',
      message: 'Additional medical teams sent to Dharavi and Chembur areas to assist affected residents.',
      time: '2 hours ago',
      read: true
    },
    {
      id: '5',
      type: 'alert',
      title: 'Emergency Resources Request',
      message: 'Urgent need for water purification tablets and blankets at Kurla relief camp.',
      time: '3 hours ago',
      read: false
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const filteredNotifications = () => {
    switch (activeTab) {
      case 'alerts':
        return notifications.filter(n => n.type === 'alert');
      case 'updates':
        return notifications.filter(n => n.type === 'update');
      case 'info':
        return notifications.filter(n => n.type === 'info');
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              Notification Center
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Stay updated with real-time emergency notifications
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts
              {notifications.filter(n => n.type === 'alert' && !n.read).length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {notifications.filter(n => n.type === 'alert' && !n.read).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="space-y-1">
              {filteredNotifications().length > 0 ? (
                filteredNotifications().map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No notifications in this category
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
