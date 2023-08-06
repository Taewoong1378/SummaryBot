import { useEffect, useState } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-inner-declarations
      const handleResize = () => {
        if (
          windowSize.width === 0 ||
          windowSize.width !== window.innerWidth ||
          windowSize.height !== window.innerHeight
        ) {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowSize;
};
