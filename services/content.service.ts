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
    
    const newItem: ContentItem = {
      id: Math.random().toString(36).substr(2, 9),
      teacherId,
      title: data.title,
      subject: data.subject,
      description: data.description,
      fileUrl: URL.createObjectURL(data.file), // Mock URL
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
    
    // Find content that is approved, matches teacherId, and is within time range
    const active = allContent.find((item) => {
      if (item.teacherId !== teacherId || item.status !== 'approved') return false;
      
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);
      return now >= start && now <= end;
    });

    return active || null;
  },

  _getAllContent(): ContentItem[] {
    if (typeof window === 'undefined') return [];
    const contentStr = localStorage.getItem(CONTENT_KEY);
    return contentStr ? JSON.parse(contentStr) : [];
  }
};
