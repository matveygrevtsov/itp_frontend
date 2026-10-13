import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { UploadedImage } from '../../types/images';
import {
  Container,
  UploadZone,
  UploadIcon,
  UploadText,
  FileInput,
  BrowseButton,
  ImageGrid,
  ImageCard,
  ImagePreview,
  ImageName,
  ClearButton,
  LoadingText,
  UploadStats,
  Header,
  SubHeader
} from './styles';

interface ImageUploaderProps {
  onImagesUploaded?: (images: UploadedImage[]) => void;
}

const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImages = (files: FileList): File[] => {
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        console.warn(`Формат файла ${file.name} не поддерживается. Поддерживаются только: .png, .jpg, .jpeg`);
        return;
      }
      validFiles.push(file);
    });
    
    return validFiles;
  };

  const processImages = useCallback((files: File[]) => {
    setIsLoading(true);
    
    const newImages: UploadedImage[] = files.map(file => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const previewUrl = URL.createObjectURL(file);
      
      console.log('Загружено изображение:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      return {
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        uploadedAt: new Date()
      };
    });

    setUploadedImages(prev => [...prev, ...newImages]);
    onImagesUploaded?.(newImages);
    setIsLoading(false);
  }, [onImagesUploaded]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const validFiles = validateImages(files);
    if (validFiles.length > 0) {
      processImages(validFiles);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processImages]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    const validFiles = validateImages(files);
    
    if (validFiles.length > 0) {
      processImages(validFiles);
    }
  }, [processImages]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  const clearImages = useCallback(() => {
    uploadedImages.forEach(image => {
      URL.revokeObjectURL(image.previewUrl);
    });
    setUploadedImages([]);
    console.log('Все изображения удалены');
  }, [uploadedImages]);

  const handleBrowseClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  }, []);

  return (
    <Container>
      <Header>📁 Конвертер изображений в PDF</Header>
      <SubHeader>Загрузите изображения, которые будут преобразованы в PDF файл</SubHeader>
      
      <UploadZone
        isDragOver={isDragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <UploadIcon>📁</UploadIcon>
        <UploadText>
          Перетащите сюда изображения или нажмите кнопку ниже
          <small>Поддерживаемые форматы: .png, .jpg, .jpeg</small>
        </UploadText>
        
        <BrowseButton onClick={handleBrowseClick}>
          Выбрать файлы
        </BrowseButton>
        
        <FileInput
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          multiple
          onChange={handleFileSelect}
        />
        
        {isLoading && <LoadingText>Обработка изображений...</LoadingText>}
      </UploadZone>
      
      {uploadedImages.length > 0 && (
        <>
          <UploadStats>
            Загружено изображений: {uploadedImages.length}
            {uploadedImages.length > 0 && (
              <div style={{ marginTop: '4px' }}>
                Всего: {(uploadedImages.reduce((sum, img) => sum + img.size, 0) / (1024 * 1024)).toFixed(2)} MB
              </div>
            )}
          </UploadStats>
          
          <ImageGrid>
            {uploadedImages.map((image) => (
              <ImageCard key={image.id}>
                <ImagePreview src={image.previewUrl} alt={image.name} />
                <ImageName title={image.name}>
                  {image.name.length > 15 ? image.name.substring(0, 12) + '...' : image.name}
                </ImageName>
              </ImageCard>
            ))}
          </ImageGrid>
          
          <ClearButton onClick={clearImages} disabled={isLoading}>
            Очистить все изображения
          </ClearButton>
        </>
      )}
    </Container>
  );
};