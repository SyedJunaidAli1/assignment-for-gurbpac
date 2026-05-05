'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { approvalService } from '@/services/approval.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Files, 
  Clock, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function PrincipalDashboard() {
  const { data: allContent, isLoading } = useQuery({
    queryKey: ['allContent'],
    queryFn: () => approvalService.getAllContent(),
  });

  const stats = [
    {
      label: 'All Content',
      value: allContent?.length || 0,
      icon: Files,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Pending Approvals',
      value: allContent?.filter(c => c.status === 'pending').length || 0,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Approved',
      value: allContent?.filter(c => c.status === 'approved').length || 0,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Rejected',
      value: allContent?.filter(c => c.status === 'rejected').length || 0,
      icon: XCircle,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
        <p className="text-muted-foreground">
          Monitor and manage content broadcasting across the school.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-1" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Activity className="mr-1 h-3 w-3 text-primary" />
                  <span>Real-time monitoring active</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
         <Card className="lg:col-span-2 border-none shadow-md">
           <CardHeader>
             <CardTitle>Recent Activity</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)
                ) : allContent?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No recent activity found.</p>
                ) : (
                  allContent?.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Files className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Uploaded on {format(new Date(item.createdAt), 'MMM d, yyyy')}</p>
                      </div>
                      <Badge variant={item.status === 'approved' ? 'default' : item.status === 'rejected' ? 'destructive' : 'outline'}>
                        {item.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
           </CardContent>
         </Card>

         <Card className="border-none shadow-md">
           <CardHeader>
             <CardTitle>System Health</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Storage Usage</span>
                  <span>45%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[45%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>API Response Time</span>
                  <span>124ms</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[20%]" />
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-emerald-500">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  All systems operational
                </div>
              </div>
           </CardContent>
         </Card>
      </div>
    </div>
  );
}

