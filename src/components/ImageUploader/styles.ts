import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

export const UploadZone = styled.div<{ isDragOver: boolean }>`
  width: 100%;
  height: 300px;
  border: 3px dashed ${props => props.isDragOver ? '#3b82f6' : '#4b5563'};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px;
  background: ${props => props.isDragOver ? 'rgba(59, 130, 246, 0.1)' : 'rgba(75, 85, 99, 0.1)'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }
`;

export const UploadIcon = styled.div`
  font-size: 48px;
  color: #9ca3af;
`;

export const UploadText = styled.p`
  color: #9ca3af;
  text-align: center;
  font-size: 16px;
  margin: 0;
  
  small {
    display: block;
    font-size: 12px;
    margin-top: 4px;
    opacity: 0.8;
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const BrowseButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #6b7280;
    cursor: not-allowed;
  }
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 32px;
`;

export const ImageCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

export const ImagePreview = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
`;

export const ImageName = styled.div`
  padding: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ClearButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: 20px;
  
  &:hover {
    background: #dc2626;
  }
  
  &:disabled {
    background: #6b7280;
    cursor: not-allowed;
  }
`;

export const LoadingText = styled.div`
  color: #9ca3af;
  font-size: 14px;
  margin-top: 10px;
`;

export const UploadStats = styled.div`
  color: #9ca3af;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
`;

export const Header = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 16px;
`;

export const SubHeader = styled.div`
  font-size: 16px;
  color: #9ca3af;
  text-align: center;
  margin-bottom: 32px;
`;