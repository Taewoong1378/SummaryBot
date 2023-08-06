import classNames from 'classnames';

import { STICKER_COLOR, STICKER_SIZE, StickerProps } from './Sticker.type';

export const Sticker = ({
  text,
  color = STICKER_COLOR.YELLOW,
  size,
  className,
  ...props
}: StickerProps) => {
  return (
    <span
      className={classNames(
        `bg-${color} inline-block whitespace-nowrap rounded-[3px] ${className}`,
        size === STICKER_SIZE.MEDIUM && 'text-Tag1 px-8 py-4',
        size === STICKER_SIZE.SMALL && 'text-Tag2 px-5 py-3',
      )}
      {...props}>
      {text}
    </span>
  );
};
