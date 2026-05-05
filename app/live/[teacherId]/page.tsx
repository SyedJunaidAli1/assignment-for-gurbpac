'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services/content.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Radio, Info, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PublicLivePage() {
  const { teacherId } = useParams();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for UI purposes
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll for active content every 10 seconds
  const { data: activeContent, isLoading, isError } = useQuery({
    queryKey: ['activeContent', teacherId],
    queryFn: () => contentService.getActiveContent(teacherId as string),
    refetchInterval: 2000, // 2 second polling for smooth rotation
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="space-y-8 w-full max-w-4xl">
           <Skeleton className="h-[500px] w-full rounded-2xl bg-zinc-900" />
           <div className="space-y-4">
             <Skeleton className="h-8 w-1/3 bg-zinc-900" />
             <Skeleton className="h-4 w-1/2 bg-zinc-900" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-primary-foreground overflow-hidden">
      {/* Header / Status Bar */}
      <div className="absolute top-0 left-0 w-full z-20 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-sm font-bold tracking-wider uppercase">Live Broadcast</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/20" />
          <div className="hidden sm:flex items-center gap-2 text-sm text-white/60">
            <Clock className="h-4 w-4" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-white/20 text-white/80 backdrop-blur-md px-4 py-1">
            {teacherId}
          </Badge>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative h-screen w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!activeContent ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center text-center p-8 space-y-6"
            >
              <div className="p-8 rounded-full bg-white/5 border border-white/10 mb-4">
                <Radio className="h-16 w-16 text-white/20 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">No content available</h1>
                <p className="text-xl text-white/40 max-w-md mx-auto">
                  The broadcaster is currently offline or hasn't scheduled any content for this time.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={activeContent.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative"
            >
              {/* The Image/Content */}
              <img 
                src={activeContent.fileUrl} 
                alt={activeContent.title} 
                className="w-full h-full object-contain" 
              />
              
              {/* Content Information Overlay (Bottom) */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-black to-transparent">
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="max-w-4xl space-y-4"
                >
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary hover:bg-primary text-primary-foreground">
                      {activeContent.subject}
                    </Badge>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                    {activeContent.title}
                  </h2>
                  {activeContent.description && (
                    <p className="text-lg md:text-xl text-white/60 font-medium max-w-2xl line-clamp-2">
                      {activeContent.description}
                    </p>
                  )}
                  <div className="flex items-center gap-6 pt-4 text-white/40 text-sm font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Active Period: {new Date(activeContent.startTime).toLocaleTimeString()} - {new Date(activeContent.endTime).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Background Blur */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-primary/10 rounded-full blur-[150px] opacity-20" />
      </div>
    </div>
  );
}
