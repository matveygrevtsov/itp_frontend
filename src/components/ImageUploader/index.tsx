import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UploadedImage } from '../../types/images';
import { reorder } from '../../utils/reorder';
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
  ImageOrderBadge,
  ImageControls,
  OrderButton,
  RemoveButton,
  ReorderHint,
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
  // Индекс перетаскиваемой карточки и индекс позиции, куда она будет вставлена
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Коллбэк держим в ref, чтобы его пересоздание в родителе
  // не приводило к лишним вызовам из эффекта ниже
  const onImagesUploadedRef = useRef(onImagesUploaded);

  useEffect(() => {
    onImagesUploadedRef.current = onImagesUploaded;
  }, [onImagesUploaded]);

  // Любое изменение состава или порядка изображений отдаём наружу,
  // т.к. порядок определяет последовательность страниц в итоговом PDF
  useEffect(() => {
    onImagesUploadedRef.current?.(uploadedImages);
  }, [uploadedImages]);

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
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
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
    setIsLoading(false);
  }, []);

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
    if (!files || files.length === 0) return;

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
    setUploadedImages(prev => {
      prev.forEach(image => URL.revokeObjectURL(image.previewUrl));
      return [];
    });
    console.log('Все изображения удалены');
  }, []);

  const removeImage = useCallback((id: string) => {
    setUploadedImages(prev => {
      const target = prev.find(image => image.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter(image => image.id !== id);
    });
  }, []);

  // Перемещение изображения с позиции fromIndex на позицию toIndex
  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    setUploadedImages(prev => {
      const next = reorder(prev, fromIndex, toIndex);

      if (next !== prev) {
        console.log(
          `Изображение "${prev[fromIndex].name}" перемещено: позиция ${fromIndex + 1} → ${toIndex + 1}`
        );
      }

      return next;
    });
  }, []);

  const handleBrowseClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  }, []);

  const handleCardDragStart = useCallback(
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      setDraggedIndex(index);
      setDropTargetIndex(index);
      event.dataTransfer.effectAllowed = 'move';
      // Данные нужны, чтобы перетаскивание корректно работало в Firefox
      event.dataTransfer.setData('text/plain', String(index));
    },
    []
  );

  const handleCardDragOver = useCallback(
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      if (draggedIndex === null) return;
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'move';
      setDropTargetIndex(index);
    },
    [draggedIndex]
  );

  const handleCardDrop = useCallback(
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      if (draggedIndex === null) return;
      event.preventDefault();
      event.stopPropagation();
      moveImage(draggedIndex, index);
      setDraggedIndex(null);
      setDropTargetIndex(null);
    },
    [draggedIndex, moveImage]
  );

  const handleCardDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, []);

  // Перемещение с клавиатуры: Ctrl/Cmd + стрелки влево/вправо
  const handleCardKeyDown = useCallback(
    (index: number) => (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!event.ctrlKey && !event.metaKey) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveImage(index, index - 1);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveImage(index, index + 1);
      }
    },
    [moveImage]
  );

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
            <div style={{ marginTop: '4px' }}>
              Всего: {(uploadedImages.reduce((sum, img) => sum + img.size, 0) / (1024 * 1024)).toFixed(2)} MB
            </div>
          </UploadStats>

          <ReorderHint>
            Перетаскивайте карточки, чтобы изменить порядок страниц в PDF.
            Также можно использовать кнопки ← → или Ctrl/Cmd + стрелки.
          </ReorderHint>

          <ImageGrid role="list">
            {uploadedImages.map((image, index) => (
              <ImageCard
                key={image.id}
                draggable
                tabIndex={0}
                role="listitem"
                aria-label={`Страница ${index + 1} из ${uploadedImages.length}: ${image.name}`}
                isDragging={draggedIndex === index}
                isDropTarget={dropTargetIndex === index && draggedIndex !== index}
                onDragStart={handleCardDragStart(index)}
                onDragOver={handleCardDragOver(index)}
                onDrop={handleCardDrop(index)}
                onDragEnd={handleCardDragEnd}
                onKeyDown={handleCardKeyDown(index)}
              >
                <ImageOrderBadge>{index + 1}</ImageOrderBadge>
                <ImagePreview src={image.previewUrl} alt={image.name} />
                <ImageName title={image.name}>
                  {image.name.length > 15 ? image.name.substring(0, 12) + '...' : image.name}
                </ImageName>
                <ImageControls>
                  <OrderButton
                    type="button"
                    title="Переместить влево"
                    aria-label={`Переместить "${image.name}" влево`}
                    disabled={index === 0}
                    onClick={() => moveImage(index, index - 1)}
                  >
                    ←
                  </OrderButton>
                  <OrderButton
                    type="button"
                    title="Переместить вправо"
                    aria-label={`Переместить "${image.name}" вправо`}
                    disabled={index === uploadedImages.length - 1}
                    onClick={() => moveImage(index, index + 1)}
                  >
                    →
                  </OrderButton>
                  <RemoveButton
                    type="button"
                    title="Удалить изображение"
                    aria-label={`Удалить "${image.name}"`}
                    onClick={() => removeImage(image.id)}
                  >
                    ✕
                  </RemoveButton>
                </ImageControls>
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