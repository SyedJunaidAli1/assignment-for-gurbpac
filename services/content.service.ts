import { ContentItem, CreateContentData } from '@/types/content';

const CONTENT_KEY = 'broadcast_content';

export const contentService = {
  async getMyContent(teacherId: string): Promise<ContentItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const allContent = this._getAllContent();
    return allContent.filter((item) => item.teacherId === teacherId);
  },

  async uploadContent(teacherId: string, data: CreateContentData): Promise<ContentItem> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Convert file to base64 for persistent mock storage
    const base64File = await this._fileToBase64(data.file);
    
    const newItem: ContentItem = {
      id: Math.random().toString(36).substr(2, 9),
      teacherId,
      title: data.title,
      subject: data.subject,
      description: data.description,
      fileUrl: base64File,
      fileType: data.file.type,
      startTime: data.startTime,
      endTime: data.endTime,
      rotationDuration: data.rotationDuration,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const allContent = this._getAllContent();
    allContent.push(newItem);
    localStorage.setItem(CONTENT_KEY, JSON.stringify(allContent));
    
    return newItem;
  },

  async getActiveContent(teacherId: string): Promise<ContentItem | null> {
    const allContent = this._getAllContent();
    const now = new Date();
    
    // 1. Filter for items that are approved, match teacherId, and are within time range
    const activeItems = allContent.filter((item) => {
      const isTeacherMatch = String(item.teacherId) === String(teacherId);
      const isApproved = item.status === 'approved';
      
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);
      const isTimeMatch = now >= start && now <= end;
      
      return isTeacherMatch && isApproved && isTimeMatch;
    });

    if (activeItems.length === 0) return null;
    if (activeItems.length === 1) return activeItems[0];

    // 2. Implement rotation logic
    // Calculate total cycle duration
    const totalCycleDuration = activeItems.reduce((acc, item) => acc + (item.rotationDuration || 10), 0);
    
    // Get current position in the cycle (in seconds)
    const currentCycleSecond = Math.floor(Date.now() / 1000) % totalCycleDuration;
    
    // Find which item corresponds to this second
    let cumulativeSeconds = 0;
    for (const item of activeItems) {
      cumulativeSeconds += (item.rotationDuration || 10);
      if (currentCycleSecond < cumulativeSeconds) {
        return item;
      }
    }

    return activeItems[0];
  },

  _getAllContent(): ContentItem[] {
    if (typeof window === 'undefined') return [];
    const contentStr = localStorage.getItem(CONTENT_KEY);
    return contentStr ? JSON.parse(contentStr) : [];
  },

  _fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
};
