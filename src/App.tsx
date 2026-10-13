import React, { useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { ImageUploader } from './components/ImageUploader/index';
import { UploadedImage } from './types/images';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #0f172a;
    color: #ffffff;
    min-height: 100vh;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400px;
    background: linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
    z-index: -1;
    pointer-events: none;
  }
`;

const InfoBox = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-top: 32px;
  max-width: 600px;
  width: 100%;
  font-size: 14px;
  color: #94a3b8;
  
  h3 {
    color: #ffffff;
    margin-bottom: 8px;
    font-size: 16px;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      margin: 4px 0;
      padding-left: 16px;
      position: relative;
      
      &::before {
        content: '→';
        position: absolute;
        left: 0;
        color: #3b82f6;
      }
    }
  }
`;

const Footer = styled.footer`
  margin-top: 40px;
  text-align: center;
  color: #64748b;
  font-size: 12px;
  padding: 16px;
`;

export const App = () => {
  const handleImagesUploaded = useCallback((images: UploadedImage[]) => {
    console.log(
      'Текущий порядок изображений для PDF:',
      images.map((image, index) => `${index + 1}. ${image.name}`),
    );
  }, []);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <ImageUploader onImagesUploaded={handleImagesUploaded} />
        
        <InfoBox>
          <h3>ℹ️ Как это работает?</h3>
          <ul>
            <li>Перетащите изображения в зону загрузки или нажмите «Выбрать файлы»</li>
            <li>Поддерживаются форматы: PNG, JPG, JPEG</li>
            <li>Порядок карточек задаёт порядок страниц в PDF</li>
            <li>Меняйте порядок перетаскиванием карточек или кнопками ← →</li>
            <li>В будущем они будут отправлены на бэкенд для конвертации в PDF</li>
          </ul>
        </InfoBox>
        
        <Footer>
          Drag & Drop загрузчик изображений для конвертации в PDF • Режим разработки
        </Footer>
      </AppContainer>
    </>
  );
};
