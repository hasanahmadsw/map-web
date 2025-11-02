export interface Media {
  name: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaParams {
  page?: number;
  limit?: number;
  type?: 'image' | 'video' | 'all';
  orderBy?: 'created_at' | 'updated_at' | 'name';
  orderDir?: 'asc' | 'desc';
}