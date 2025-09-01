import { FormItemProps, InputProps } from 'antd';
import { ReactNode } from 'react';

export interface CustomLabelContentProps {
  title: ReactNode;
  tips: ReactNode;
}

export interface FormInputBotBorderProps extends InputProps {}

export interface FormItemLabelProps extends FormItemProps {}

export interface FormItemNoLabelProps extends FormItemProps {}
