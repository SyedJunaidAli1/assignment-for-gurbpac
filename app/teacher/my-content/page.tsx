'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { contentService } from '@/services/content.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

export default function MyContentPage() {
  const { user } = useAuth();

  const { data: myContent, isLoading } = useQuery({
    queryKey: ['myContent', user?.id],
    queryFn: () => contentService.getMyContent(user!.id),
    enabled: !!user?.id,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline" className="gap-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"><Clock className="h-3 w-3" /> Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle>My Uploaded Content</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] pl-6">Preview</TableHead>
                <TableHead>Content Info</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-12 w-16 rounded-md" /></TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px] mb-2" />
                      <Skeleton className="h-3 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3 w-[120px] mb-1" />
                      <Skeleton className="h-3 w-[120px]" />
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-[80px] rounded-full" /></TableCell>
                    <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : myContent?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-4 bg-muted rounded-full">
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold">No content found</p>
                        <p className="text-sm text-muted-foreground">You haven't uploaded any content yet.</p>
                      </div>
                      <Link
                        href="/teacher/upload"
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                      >
                        Upload your first content
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                myContent?.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell className="pl-6">
                      <div className="relative h-12 w-16 overflow-hidden rounded-md border border-border">
                        <img src={item.fileUrl} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground line-clamp-1">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.subject}</span>
                        {item.status === 'rejected' && item.rejectionReason && (
                          <span className="text-[10px] text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-2 w-2" />
                            Reason: {item.rejectionReason}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground gap-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(item.startTime), 'MMM d, h:mm a')}
                        </div>
                        <div className="flex items-center gap-1 pl-4">
                          to {format(new Date(item.endTime), 'MMM d, h:mm a')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 rounded-full")}>
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" /> View Preview
                          </DropdownMenuItem>
                          {item.status === 'rejected' && (
                            <DropdownMenuItem className="gap-2 text-primary">
                              Re-submit
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
