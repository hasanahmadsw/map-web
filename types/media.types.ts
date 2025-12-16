export interface Media {
  name: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFolder {
  name: string;
  path: string;
}

export interface MediaTreeResponse {
  folders: MediaFolder[];
  files: Media[];
}

export interface MediaParams {
  page?: number;
  limit?: number;
  type?: 'image' | 'video' | 'all';
  orderBy?: 'created_at' | 'updated_at' | 'name';
  orderDir?: 'asc' | 'desc';
  folder?: string; // relative path of the current folder (example: "banners/homepage")
}
