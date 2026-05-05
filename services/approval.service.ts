import { ContentItem, ContentStatus } from '@/types/content';

const CONTENT_KEY = 'broadcast_content';

export const approvalService = {
  async getAllPending(): Promise<ContentItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const allContent = this._getAllContent();
    return allContent.filter((item) => item.status === 'pending');
  },

  async getAllContent(): Promise<ContentItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return this._getAllContent();
  },

  async approveContent(contentId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    this._updateStatus(contentId, 'approved');
  },

  async rejectContent(contentId: string, reason: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    this._updateStatus(contentId, 'rejected', reason);
  },

  _updateStatus(contentId: string, status: ContentStatus, reason?: string) {
    const allContent = this._getAllContent();
    const index = allContent.findIndex((item) => item.id === contentId);
    if (index !== -1) {
      allContent[index].status = status;
      if (reason) allContent[index].rejectionReason = reason;
      localStorage.setItem(CONTENT_KEY, JSON.stringify(allContent));
    }
  },

  _getAllContent(): ContentItem[] {
    if (typeof window === 'undefined') return [];
    const contentStr = localStorage.getItem(CONTENT_KEY);
    return contentStr ? JSON.parse(contentStr) : [];
  }
};
