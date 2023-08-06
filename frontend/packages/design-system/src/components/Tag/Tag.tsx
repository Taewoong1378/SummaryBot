import classNames from 'classnames';

import { Icon } from '../Icon';
import { TAG_COLOR, TagProps } from './Tag.type';

export const Tag = ({ text, color = TAG_COLOR.GRAY, icon, className, ...props }: TagProps) => {
  return (
    <span
      className={classNames(
        `bg-${color} inline-block whitespace-nowrap rounded-[3px] px-8 py-1 ${className}`,
        icon ? 'text-Body7' : 'text-Body6',
      )}
      {...props}>
      {text}
      {icon && <Icon icon={icon.type} size={icon.size ?? 24} color={icon.color ?? 'gray-900'} />}
    </span>
  );
};
