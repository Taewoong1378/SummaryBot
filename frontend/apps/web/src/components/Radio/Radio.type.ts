import { InputHTMLAttributes, ReactNode } from 'react';

export type RadioProps = InputHTMLAttributes<HTMLInputElement>;

export interface RadioWithLabelProps extends RadioProps {
  label: string | ReactNode;
}
