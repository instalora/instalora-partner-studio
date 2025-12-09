import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Bell, Check, Package, Image, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'generation' | 'package' | 'payment' | 'system';
};

const notifications: Notification[] = [
  {
    id: '1',
    title: 'Generation Complete',
    message: 'Your batch of 10 images with Sofia Martinez has been completed.',
    time: '2 minutes ago',
    read: false,
    type: 'generation'
  },
  {
    id: '2',
    title: 'Package Activated',
    message: 'Your Pro Creator package is now active with 100 credits.',
    time: '1 hour ago',
    read: false,
    type: 'package'
  },
  {
    id: '3',
    title: 'Payment Successful',
    message: 'Payment of $99 for Pro Creator package was successful.',
    time: '1 hour ago',
    read: true,
    type: 'payment'
  },
  {
    id: '4',
    title: 'New Models Available',
    message: '5 new models have been added to the Fashion category.',
    time: '3 hours ago',
    read: true,
    type: 'system'
  },
  {
    id: '5',
    title: 'Generation Complete',
    message: 'Your video generation with Alex Chen is ready for download.',
    time: '1 day ago',
    read: true,
    type: 'generation'
  },
];

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'generation':
      return <Image className="h-5 w-5" />;
    case 'package':
      return <Package className="h-5 w-5" />;
    case 'payment':
      return <CreditCard className="h-5 w-5" />;
    case 'system':
      return <AlertCircle className="h-5 w-5" />;
  }
};

const Notifications = () => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                notification.read 
                  ? "bg-card border-border" 
                  : "bg-primary/5 border-primary/20"
              )}
            >
              <div className={cn(
                "p-2 rounded-full",
                notification.read ? "bg-muted" : "bg-primary/10 text-primary"
              )}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{notification.title}</h3>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <span className="text-xs text-muted-foreground mt-2 block">
                  {notification.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
