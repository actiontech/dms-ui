import { TitleProps } from 'antd5/es/typography/Title';
import { FormItemSubTitleStyleWrapper } from './style';

interface IFormItemSubTitle extends TitleProps {}

const FormItemSubTitle = (props: IFormItemSubTitle) => {
  const { children, ...params } = props;
  return (
    <FormItemSubTitleStyleWrapper {...params}>
      {children}
    </FormItemSubTitleStyleWrapper>
  );
};

export default FormItemSubTitle;
