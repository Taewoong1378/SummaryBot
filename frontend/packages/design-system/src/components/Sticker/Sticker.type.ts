export enum STICKER_COLOR {
  YELLOW = 'DTYellow-400',
  // RED = 'DTRed-400',
  // BLUE = 'DTBlue-400',
  // GREEN = 'DTGreen-400',
}

export enum STICKER_SIZE {
  SMALL = 'small',
  MEDIUM = 'medium',
}

export interface StickerProps {
  text: string;
  size: STICKER_SIZE;
  color?: STICKER_COLOR;
  className?: string;
}
