'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { contentService } from '@/services/content.service';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, X, FileImage, Loader2, Calendar } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().min(1, 'Please select a subject'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  rotationDuration: z.number().min(5, 'Minimum 5 seconds'),
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
  message: "End time must be after start time",
  path: ["endTime"],
});

type UploadForm = z.infer<typeof uploadSchema>;

const subjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "Computer Science", "English"
];

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      rotationDuration: 10,
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
        toast.error("Invalid file type. Only JPG, PNG, and GIF are allowed.");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const onSubmit = async (data: UploadForm) => {
    if (!file) {
      toast.error("Please upload a file");
      return;
    }

    setIsSubmitting(true);
    try {
      await contentService.uploadContent(user!.id, {
        ...data,
        file,
      });
      toast.success("Content uploaded successfully and pending approval!");
      router.push('/teacher/my-content');
    } catch (error) {
      toast.error("Failed to upload content");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: File Upload */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">File Upload</CardTitle>
                <CardDescription>JPG, PNG, GIF (Max 10MB)</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  {...getRootProps()} 
                  className={`
                    relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                    ${preview ? 'p-0 h-64' : 'p-8 h-48 flex flex-col items-center justify-center'}
                  `}
                >
                  <input {...getInputProps()} />
                  
                  {preview ? (
                    <div className="group relative w-full h-full">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <p className="text-white font-medium">Click or drag to replace</p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Click or drag to upload</p>
                      <p className="text-xs text-muted-foreground">Supported: .jpg, .png, .gif</p>
                    </div>
                  )}
                </div>
                {file && (
                   <div className="mt-4 flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
                     <FileImage className="h-4 w-4 text-primary" />
                     <span className="text-xs truncate font-medium">{file.name}</span>
                     <span className="text-[10px] text-muted-foreground ml-auto">
                       {(file.size / 1024 / 1024).toFixed(2)} MB
                     </span>
                   </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Content Details</CardTitle>
                <CardDescription>Information about your broadcast content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Introduction to Algebra" {...register('title')} />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select onValueChange={(val) => setValue('subject', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((sub) => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Briefly describe the content..." 
                    className="h-24 resize-none"
                    {...register('description')} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <div className="relative">
                      <Input 
                        id="startTime" 
                        type="datetime-local" 
                        className="pl-10"
                        {...register('startTime')} 
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    {errors.startTime && <p className="text-xs text-destructive">{errors.startTime.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <div className="relative">
                      <Input 
                        id="endTime" 
                        type="datetime-local" 
                        className="pl-10"
                        {...register('endTime')} 
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    {errors.endTime && <p className="text-xs text-destructive">{errors.endTime.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rotationDuration">Rotation Duration (Seconds)</Label>
                  <Input 
                    id="rotationDuration" 
                    type="number" 
                    {...register('rotationDuration', { valueAsNumber: true })} 
                  />
                  <p className="text-[10px] text-muted-foreground">How long this item stays on screen during the broadcast loop.</p>
                  {errors.rotationDuration && <p className="text-xs text-destructive">{errors.rotationDuration.message}</p>}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-11" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading Content...
                    </>
                  ) : (
                    'Submit for Approval'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
