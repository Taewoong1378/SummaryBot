import React from 'react';

import { Input } from '@components';

interface TopicSectionProps {
  onTopicChange: (topic: string) => void;
}

export const TopicSection = ({ onTopicChange }: TopicSectionProps) => {
  return (
    <div className='w-full'>
      <div className='text-Title2'>3. Summary Topic</div>
      <Input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onTopicChange(e.target.value);
        }}
        placeholder='Topic'
        maxLength={20}
      />
    </div>
  );
};
