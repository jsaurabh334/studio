
"use client";

import { useState, useMemo } from 'react';
import { AlertTriangle, Bell, DollarSign, Package, Check, Trash2 } from "lucide-react";
import { alerts as initialAlerts, Alert as AlertType } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";

const alertIcons: Record<AlertType['type'], React.ReactNode> = {
  delay: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  stock: <Package className="h-5 w-5 text-blue-500" />,
  payment: <DollarSign className="h-5 w-5 text-red-500" />,
  safety: <Bell className="h-5 w-5 text-green-500" />,
};

const alertColors: Record<AlertType['type'], string> = {
    delay: 'border-yellow-500/20 bg-yellow-500/5',
    stock: 'border-blue-500/20 bg-blue-500/5',
    payment: 'border-red-500/20 bg-red-500/5',
    safety: 'border-green-500/20 bg-green-500/5',
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertType[]>(initialAlerts);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredAlerts = useMemo(() => {
    if (filter === 'unread') return alerts.filter(a => !a.read);
    if (filter === 'read') return alerts.filter(a => a.read);
    return alerts;
  }, [alerts, filter]);

  const handleMarkAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const handleClearAll = () => {
    setAlerts([]);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Alerts & Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with important events and potential issues.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Inbox</CardTitle>
          <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={alerts.every(a => a.read)}>
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearAll} disabled={alerts.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="mb-4">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="read">Read</TabsTrigger>
                </TabsList>
            </Tabs>

          <div className="space-y-4">
            {filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
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
            )) : (
                <div className="text-center py-12 text-muted-foreground">
                    <Bell className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-lg font-semibold">All caught up!</h3>
                    <p className="text-sm">There are no {filter !== 'all' ? filter : ''} alerts at this time.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
