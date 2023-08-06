import classNames from 'classnames';
import { motion } from 'framer-motion';

import { Icon } from '../Icon';
import { BOXBUTTON_COLOR, BoxButtonProps } from './Button.type';

export const BoxButton = ({ color, icon, text, className, ...props }: BoxButtonProps) => (
  <motion.button
    className={classNames(
      'text-Section-Title flex w-full items-center justify-center gap-6 whitespace-nowrap rounded-md py-14 disabled:text-gray-400',
      color === BOXBUTTON_COLOR.WHITE && 'border-1 border-gray-250',
      color === BOXBUTTON_COLOR.BLACK ? 'text-white' : 'text-gray-800',
      color === BOXBUTTON_COLOR.DTYellow && `bg-[${BOXBUTTON_COLOR.DTYellow}] text-black`,
      props.disabled ? 'bg-gray-250' : `bg-${color}`,
      className,
    )}
    type='button'
    whileTap={{ scale: 0.97 }}
    {...props}>
    {text}
    {icon && <Icon icon={icon.type} size={icon.size ?? 16} color={icon.color ?? 'gray-600'} />}
  </motion.button>
);
