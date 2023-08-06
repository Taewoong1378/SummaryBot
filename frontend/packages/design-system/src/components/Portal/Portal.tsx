import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { motion } from 'framer-motion';

import styles from './Overlay.module.scss';

interface PortalProps {
  children: ReactNode;
  isBackgroundBlack?: boolean;
  onClickBackground?: () => void;
  initialColor?: string;
  animateColor?: string;
  isStopPrapagation?: boolean;
  position?: 'initial' | 'fixed';
}

export const Portal = ({
  children,
  isBackgroundBlack = true,
  onClickBackground,
  initialColor,
  animateColor,
  isStopPrapagation = true,
  position = 'fixed',
}: PortalProps) => {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>('#portal');
    document.body.style.overflow = 'hidden';
    setMounted(true);
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  return mounted && ref.current
    ? createPortal(
        <motion.div
          onClick={onClickBackground}
          initial={{ background: initialColor ?? 'rgba(13, 19, 23, 0)' }}
          animate={
            animateColor ??
            (isBackgroundBlack
              ? { background: 'rgba(13, 19, 23, 0.4)' }
              : { background: 'rgba(13, 19, 23, 0)' })
          }
          exit={{ background: initialColor ?? 'rgba(13, 19, 23, 0)' }}
          className={styles.overlay}
          style={position === 'initial' ? { position: 'initial' } : { position: 'fixed' }}>
          {isStopPrapagation ? (
            <div onClick={(e) => e.stopPropagation()}>{children}</div>
          ) : (
            children
          )}
        </motion.div>,
        ref.current,
      )
    : null;
};
