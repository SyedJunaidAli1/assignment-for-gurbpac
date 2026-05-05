'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalService } from '@/services/approval.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  Eye, 
  Clock, 
  AlertCircle,
  FileText,
  Calendar,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function ApprovalsPage() {
  const queryClient = useQueryClient();
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<any>(null);

  const { data: pendingContent, isLoading } = useQuery({
    queryKey: ['pendingContent'],
    queryFn: () => approvalService.getAllPending(),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approvalService.approveContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingContent'] });
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
      toast.success('Content approved successfully');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => 
      approvalService.rejectContent(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingContent'] });
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
      setSelectedContent(null);
      setRejectionReason('');
      toast.error('Content rejected');
    },
  });

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    rejectMutation.mutate({ id: selectedContent!, reason: rejectionReason });
  };

  const openPreview = (item: any) => {
    setPreviewItem(item);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Pending Approvals</h2>
        <p className="text-muted-foreground">Review and approve content for broadcasting.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border-none shadow-md overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : pendingContent?.length === 0 ? (
        <Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 bg-muted/20">
          <Check className="h-12 w-12 text-emerald-500 mb-4 opacity-50" />
          <h3 className="text-xl font-semibold">Inbox Zero!</h3>
          <p className="text-muted-foreground">All content has been reviewed.</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {pendingContent?.map((item) => (
            <Card key={item.id} className="border-none shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden bg-muted">
                <img 
                  src={item.fileUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none">
                    {item.subject}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <Button size="sm" variant="secondary" onClick={() => openPreview(item)}>
                     <Eye className="h-4 w-4 mr-2" /> Preview
                   </Button>
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description || 'No description provided.'}</p>
                </div>

                <div className="flex flex-col gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Starts: {format(new Date(item.startTime), 'MMM d, h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>Duration: {item.rotationDuration} seconds</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700" 
                    onClick={() => approveMutation.mutate(item.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                  >
                    {approveMutation.isPending && approveMutation.variables === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" /> Approve
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => setSelectedContent(item.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-2" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Dialog open={!!selectedContent} onOpenChange={(open) => !open && setSelectedContent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this content. This will be visible to the teacher.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea 
                id="reason" 
                placeholder="e.g., Image quality is too low, or incorrect timing..." 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedContent(null)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {previewItem && (
            <div className="flex flex-col md:flex-row h-[500px]">
              <div className="md:w-2/3 bg-black flex items-center justify-center">
                <img src={previewItem.fileUrl} alt={previewItem.title} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="md:w-1/3 p-6 space-y-6 overflow-y-auto bg-card">
                <div>
                  <Badge className="mb-2">{previewItem.subject}</Badge>
                  <h2 className="text-2xl font-bold">{previewItem.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2">{previewItem.description}</p>
                </div>
                
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">Scheduled Period</p>
                      <p className="text-sm">{format(new Date(previewItem.startTime), 'MMM d, h:mm a')} - {format(new Date(previewItem.endTime), 'h:mm a')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">Rotation Speed</p>
                      <p className="text-sm">{previewItem.rotationDuration} seconds</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-auto">
                  <Button className="w-full" variant="outline" onClick={() => setIsPreviewOpen(false)}>Close Preview</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
