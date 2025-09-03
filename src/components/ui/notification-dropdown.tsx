import { Bell, Check, X, Clock, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'approval_request',
    title: 'Purchase Request Needs Approval',
    message: 'PR-2024-001: Office Supplies requires your approval',
    time: '2 minutes ago',
    unread: true,
    icon: FileText,
    color: 'text-blue-500'
  },
  {
    id: '2',
    type: 'approved',
    title: 'Purchase Request Approved',
    message: 'Your request for Marketing Materials has been approved',
    time: '1 hour ago',
    unread: true,
    icon: Check,
    color: 'text-green-500'
  },
  {
    id: '3',
    type: 'rejected',
    title: 'Purchase Request Rejected',
    message: 'PR-2024-003: Equipment Purchase was rejected',
    time: '3 hours ago',
    unread: false,
    icon: X,
    color: 'text-red-500'
  },
  {
    id: '4',
    type: 'assignment',
    title: 'New Assignment',
    message: 'You have been assigned as approver for IT Equipment',
    time: '1 day ago',
    unread: false,
    icon: User,
    color: 'text-purple-500'
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Pending Approval Reminder',
    message: 'You have 2 pending approvals that need attention',
    time: '2 days ago',
    unread: false,
    icon: Clock,
    color: 'text-orange-500'
  }
];

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-[20px] rounded-full bg-destructive text-destructive-foreground border-2 border-background">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-auto p-1"
            >
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start p-4 cursor-pointer"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <div className={`p-2 rounded-full bg-muted`}>
                      <IconComponent className={`h-4 w-4 ${notification.color}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>
                </DropdownMenuItem>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}