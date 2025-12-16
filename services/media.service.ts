import { toQS } from '@/utils/api-utils';
import { ApiService } from './base.service';
import { ApiResponse } from '@/types/common.types';
import { Media, MediaParams, MediaTreeResponse } from '@/types/media.types';

export const mediaService = {
  async getAllMedia(params?: MediaParams): Promise<ApiResponse<Media[]>> {
    const res = await ApiService.get<Media[]>(`/media${toQS(params)}`);
    return res;
  },

  async getMediaTree(folder?: string): Promise<ApiResponse<MediaTreeResponse>> {
    const params = folder ? { folder } : undefined;
    const res = await ApiService.get<MediaTreeResponse>(`/media/tree${toQS(params)}`);
    return res;
  },

  async uploadMedia(files: File[], folder?: string): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    if (folder) {
      formData.append('folder', folder);
    }

    // important: endpoint is now /media/upload
    const res = await ApiService.post<{ urls: string[] }>(`/media/upload`, formData);
    return res.data.urls;
  },

  async deleteMedia(paths: string[]): Promise<string> {
    const res = await ApiService.delete<string>(`/media`, {
      body: JSON.stringify({ paths }),
    });
    return res.data;
  },

  async createFolder(folderPath: string): Promise<void> {
    await ApiService.post<void>(`/media/folders`, { folder: folderPath });
  },
};
