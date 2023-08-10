import React from 'react';

import { HTMLMotionProps } from 'framer-motion';
import { Colors } from 'tailwind-base';

import { IconType } from '../Icon';

export enum BOXBUTTON_COLOR {
  WHITE = 'white',
  BLACK = 'black',
  DTYellow = '#FFEC42',
}

export interface BoxButtonProps extends HTMLMotionProps<'button'> {
  color: BOXBUTTON_COLOR;
  icon?: {
    type: IconType;
    size?: number;
    color?: keyof typeof Colors;
  };
  text: string | React.ReactNode;
}
