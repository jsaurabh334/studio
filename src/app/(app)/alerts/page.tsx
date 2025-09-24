import { AlertTriangle, Bell, DollarSign, Package } from "lucide-react";
import { alerts } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const alertIcons = {
  delay: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  stock: <Package className="h-5 w-5 text-blue-500" />,
  payment: <DollarSign className="h-5 w-5 text-red-500" />,
  safety: <Bell className="h-5 w-5 text-green-500" />,
};

const alertColors = {
    delay: 'border-yellow-500/20 bg-yellow-500/5',
    stock: 'border-blue-500/20 bg-blue-500/5',
    payment: 'border-red-500/20 bg-red-500/5',
    safety: 'border-green-500/20 bg-green-500/5',
}

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Alerts & Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with important events and potential issues.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-secondary/50 ${alertColors[alert.type]} ${!alert.read ? 'bg-secondary/40' : ''}`}
              >
                <div className="mt-1">{alertIcons[alert.type]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{alert.title}</p>
                    <time className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.date), { addSuffix: true })}
                    </time>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.description}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {alert.projectId}
                  </Badge>
                </div>
                {!alert.read && (
                    <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
