import { TitleProps } from 'antd/es/typography/Title';
import { FormItemSubTitleStyleWrapper } from './style';

export interface IFormItemSubTitle extends TitleProps {}

const FormItemSubTitle = (props: IFormItemSubTitle) => {
  const { children, ...params } = props;
  return (
    <FormItemSubTitleStyleWrapper {...params}>
      {children}
    </FormItemSubTitleStyleWrapper>
  );
};

export default FormItemSubTitle;
