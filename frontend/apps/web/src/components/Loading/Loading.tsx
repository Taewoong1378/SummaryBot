import { Portal } from 'design-system';
import Lottie from 'lottie-react';

import loadingAnimation from '@assets/loading.json';
import { useWindowSize } from '@hooks';

export const Loading = () => {
  const { height } = useWindowSize();

  return (
    <Portal>
      <div className='flex h-full w-full flex-col items-center'>
        <Lottie animationData={loadingAnimation} loop={true} style={{ height, width: 300 }} />
      </div>
    </Portal>
  );
};
