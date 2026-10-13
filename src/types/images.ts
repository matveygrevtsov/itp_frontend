// Типы для изображений
export interface UploadedImage {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  uploadedAt: Date;
}