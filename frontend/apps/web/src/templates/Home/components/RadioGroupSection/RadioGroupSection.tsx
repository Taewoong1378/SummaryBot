import { ChangeEvent } from 'react';

import { RadioWithLabel } from '@components';

import { ChatTypeEnum } from '../../types';

interface RadioGroupSectionProps {
  selectedChatType: ChatTypeEnum;
  onChatTypeChange: (chatType: ChatTypeEnum) => void;
}

export const RadioGroupSection = ({
  selectedChatType,
  onChatTypeChange,
}: RadioGroupSectionProps) => {
  return (
    <div>
      <div className='text-Title2'>2. Summary Type</div>
      <div className='flex w-full flex-row items-center justify-start'>
        <RadioWithLabel
          label='Q&A'
          id='qa'
          checked={selectedChatType === ChatTypeEnum.QA}
          value={ChatTypeEnum.QA}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChatTypeChange(e.target.value as ChatTypeEnum);
          }}
        />
        <RadioWithLabel
          label='Lecture'
          id='lecture'
          checked={selectedChatType === ChatTypeEnum.LECTURE}
          value={ChatTypeEnum.LECTURE}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChatTypeChange(e.target.value as ChatTypeEnum);
          }}
        />
      </div>
    </div>
  );
};
