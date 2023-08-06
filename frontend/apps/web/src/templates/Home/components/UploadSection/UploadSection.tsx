import { ChangeEvent } from 'react';

interface UploadSectionProps {
  onFileChange: (file: File) => void;
}

export const UploadSection = ({ onFileChange }: UploadSectionProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileChange(event.target.files[0]);
    }
  };

  return (
    <div>
      <div className='text-Title2'>1. Upload Txt File</div>
      <input type='file' onChange={handleFileChange} accept='.txt' />
    </div>
  );
};
