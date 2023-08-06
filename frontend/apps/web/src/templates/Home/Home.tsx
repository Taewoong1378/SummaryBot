import { useState } from 'react';

import axios from 'axios';

import { Loading } from '@components';

import { BACKEND_URL } from '@constants';

import { RadioGroupSection, TopicSection, UploadButton, UploadSection } from './components';
import { ChatTypeEnum } from './types';

export const Home = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chatType, setChatType] = useState<ChatTypeEnum>(ChatTypeEnum.QA);
  const [topic, setTopic] = useState<string>('');

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('mode', chatType);
    formData.append('topic', topic);

    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/txt`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className='flex w-full flex-col items-start gap-32 px-32'>
      {loading && <Loading />}
      <UploadSection onFileChange={setSelectedFile} />
      <RadioGroupSection selectedChatType={chatType} onChatTypeChange={setChatType} />
      <TopicSection onTopicChange={setTopic} />
      <UploadButton
        onClick={handleFileUpload}
        disabled={!selectedFile || !topic.length || !chatType}
      />
    </div>
  );
};
