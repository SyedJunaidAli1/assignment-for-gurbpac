export type ContentStatus = 'pending' | 'approved' | 'rejected';

export interface ContentItem {
  id: string;
  teacherId: string;
  title: string;
  subject: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  startTime: string;
  endTime: string;
  rotationDuration: number; // in seconds
  status: ContentStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface CreateContentData {
  title: string;
  subject: string;
  description?: string;
  file: File;
  startTime: string;
  endTime: string;
  rotationDuration: number;
}
