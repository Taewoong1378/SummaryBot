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
  const [result, setResult] = useState<string>('');

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
      const { data } = await axios.post(`${BACKEND_URL}/txt`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(data);
      setLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const onClickCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert('복사되었습니다.');
  };

  return (
    <div className='flex w-full flex-col items-start gap-32 px-32 py-16'>
      {loading && <Loading />}
      <UploadSection onFileChange={setSelectedFile} />
      <RadioGroupSection selectedChatType={chatType} onChatTypeChange={setChatType} />
      <TopicSection onTopicChange={setTopic} />
      <UploadButton
        onClick={handleFileUpload}
        disabled={!selectedFile || !topic.length || !chatType}
      />
      {result && (
        <>
          <div className='whitespace-pre-wrap'>{result}</div>{' '}
          <button
            className='mt-16 rounded bg-DTRed-400 px-16 py-8 text-white'
            onClick={() => onClickCopy(result)}>
            복사하기
          </button>
        </>
      )}
    </div>
  );
};
