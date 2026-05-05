'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { contentService } from '@/services/content.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Plus
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function TeacherDashboard() {
  const { user } = useAuth();
  
  const { data: myContent, isLoading } = useQuery({
    queryKey: ['myContent', user?.id],
    queryFn: () => contentService.getMyContent(user!.id),
    enabled: !!user?.id,
  });

  const stats = [
    {
      label: 'Total Uploaded',
      value: myContent?.length || 0,
      icon: FileText,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Pending Approval',
      value: myContent?.filter(c => c.status === 'pending').length || 0,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Approved',
      value: myContent?.filter(c => c.status === 'approved').length || 0,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Rejected',
      value: myContent?.filter(c => c.status === 'rejected').length || 0,
      icon: XCircle,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's what's happening with your content.
          </p>
        </div>
        <Link 
          href="/teacher/upload" 
          className={cn(buttonVariants({ variant: "default" }), "gap-2 shadow-lg shadow-primary/20 h-9 px-4 rounded-md")}
        >
          <Plus className="h-4 w-4" />
          Upload New Content
        </Link>
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
                  <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                  <span>+12% from last month</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
         {/* Could add a chart here if needed, but keeping it simple for now */}
         <Card className="col-span-1 md:col-span-2 overflow-hidden border-none shadow-md">
           <CardHeader>
             <CardTitle>Quick Tips</CardTitle>
           </CardHeader>
           <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h4 className="font-semibold mb-2 text-primary">High Quality Files</h4>
                <p className="text-sm text-muted-foreground">Upload images with at least 1920x1080 resolution for best live broadcast quality.</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                <h4 className="font-semibold mb-2 text-foreground">Timing is Key</h4>
                <p className="text-sm text-muted-foreground">Schedule your content at least 24 hours in advance to give the Principal time for review.</p>
              </div>
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <h4 className="font-semibold mb-2 text-foreground">Clear Titles</h4>
                <p className="text-sm text-muted-foreground">Use descriptive titles to help students identify the subject and topic quickly.</p>
              </div>
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
