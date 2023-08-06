import { Colors } from 'tailwind-base';

import { IconType } from '../Icon';

export enum TAG_COLOR {
  GRAY = 'gray-200',
  // YELLOW = 'DTYellow-400',
  // RED = 'DTRed-400',
  // BLUE = 'DTBlue-400',
  // GREEN = 'DTGreen-400',
}

export interface TagProps {
  text: string;
  icon?: {
    type: IconType;
    size?: number;
    color?: keyof typeof Colors;
  };
  color?: TAG_COLOR;
  className?: string;
}
