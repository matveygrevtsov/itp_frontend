import { UploadedImage } from '../types/images';

// Адрес эндпоинта бэкенда, который склеивает несколько изображений в один PDF
export const IMAGES_TO_PDF_URL = 'http://localhost:3000/api/images-to-pdf';

// Имя, с которым бэкенд отдаёт файл (Content-Disposition в ответе)
export const PDF_FILE_NAME = 'merged_images.pdf';

// Имя поля формы, в котором бэкенд ожидает получить изображения
const FILES_FIELD_NAME = 'files';

/**
 * Отправляет изображения на бэкенд и возвращает готовый PDF в виде Blob.
 *
 * Бэкенд ожидает multipart/form-data с файлами в поле "files"
 * и в случае успеха отвечает PDF-файлом (application/pdf).
 */
export const convertImagesToPdf = async (
  images: UploadedImage[],
): Promise<Blob> => {
  if (images.length === 0) {
    throw new Error('Не выбрано ни одного изображения');
  }

  const formData = new FormData();
  images.forEach(image => {
    // Третьим аргументом передаём оригинальное имя файла,
    // чтобы бэкенд корректно определил расширение для проверки формата
    formData.append(FILES_FIELD_NAME, image.file, image.name);
  });

  let response: Response;

  try {
    response = await fetch(IMAGES_TO_PDF_URL, {
      method: 'POST',
      body: formData,
    });
  } catch {
    // fetch выбрасывает исключение только при сетевой ошибке
    // (бэкенд недоступен, CORS и т.п.)
    throw new Error(
      `Не удалось связаться с сервером. Убедитесь, что бэкенд запущен на ${IMAGES_TO_PDF_URL}`,
    );
  }

  if (!response.ok) {
    // При ошибке бэкенд отвечает JSON вида { error, message }
    let message = `Не удалось создать PDF (код ответа ${response.status})`;

    try {
      const data = await response.json();
      if (data && typeof data.message === 'string' && data.message) {
        message = data.message;
      }
    } catch {
      // Ответ не является JSON — оставляем сообщение по умолчанию
    }

    throw new Error(message);
  }

  return response.blob();
};

// Сохраняет полученный PDF-файл на устройство пользователя
export const downloadPdf = (
  blob: Blob,
  fileName: string = PDF_FILE_NAME,
): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};
