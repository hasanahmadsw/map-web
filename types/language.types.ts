export interface Language {
  id: number;
  code: string;
  nativeName: string;
  name: string;
  isDefault: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface CreateLanguageDTO {
  code: string;
  nativeName: string;
  name: string;
  isDefault: boolean;
}
