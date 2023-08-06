import React, { DetailedHTMLProps } from 'react';

export const Input = ({
  ...props
}: DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
  return (
    <input
      className='h-40 w-full rounded-sm border-[1px] border-gray-350 px-8 outline-none'
      {...props}
    />
  );
};
