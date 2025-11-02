import { ApiResponse } from "@/types/common.types";
import { Media, MediaParams } from "@/types/media.types";
import { toQS } from "@/utils/api-utils";
import { ApiService } from "./base.service";

export const mediaService = {
  async getAllMedia(params?: MediaParams): Promise<ApiResponse<Media[]>> {
    const res = await ApiService.get<Media[]>(`/media${toQS(params)}`);
    return res;
  },

  async uploadMedia(
    files: File[],
    onProgress?: (progress: number) => void,
  ): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });
    const res = await ApiService.postWithProgress<{urls: string[]}>(
      `/media/upload`,
      formData,
      onProgress,
    );
    return res.data.urls;
  },

  async deleteMedia(paths: string[]): Promise<string> {
    const res = await ApiService.delete<string>(`/media`, {
      body: JSON.stringify({ paths }),
    });
    return res.data;
  },
};