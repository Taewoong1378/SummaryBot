import { useId } from 'react';
import { RadioProps } from '../Radio.type';
import styles from './Radio.module.css';

export const Radio = ({ value, id, name, checked, disabled, ...props }: RadioProps) => {
  const uid = useId();

  return (
    <div className={styles.radioWrapper}>
      <input
        {...props}
        type='radio'
        value={value}
        name={name}
        id={id || uid}
        aria-checked={checked}
        checked={checked}
        disabled={disabled}
      />
      <label className={styles.radio} htmlFor={id || uid}>
        <span />
      </label>
    </div>
  );
};
