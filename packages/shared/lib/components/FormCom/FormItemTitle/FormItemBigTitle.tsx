import { ReactNode } from 'react';
import { TitleProps } from 'antd/es/typography/Title';

import { FormItemBigTitleStyleWrapper } from './style';

export interface IFormItemBigTitle extends TitleProps {
  children: ReactNode;
}

const FormItemBigTitle = (props: IFormItemBigTitle) => {
  const { children, ...params } = props;
  return (
    <FormItemBigTitleStyleWrapper level={3} {...params}>
      {children}
    </FormItemBigTitleStyleWrapper>
  );
};

export default FormItemBigTitle;
