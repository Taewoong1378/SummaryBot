import { Radio } from '../Radio';
import { RadioWithLabelProps } from '../Radio.type';
import styles from './RadioWithLabel.module.css';

// @todo story 추가
export const RadioWithLabel = ({ label, ...radioProps }: RadioWithLabelProps) => {
  const uid = radioProps?.id;

  return (
    <div className={styles.radioWithLabelWrap}>
      <Radio {...radioProps} id={uid} />
      <label
        htmlFor={uid}
        className={`${styles.radioLabel} ${radioProps.disabled && styles.disabled}`}
        aria-disabled={radioProps.disabled}>
        {label}
      </label>
    </div>
  );
};
