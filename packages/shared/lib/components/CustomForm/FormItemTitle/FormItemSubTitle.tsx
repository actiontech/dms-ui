import { FormItemSubTitleStyleWrapper } from './style';
import { FormItemSubTitleProps } from './FormItemTitle.types';

const FormItemSubTitle: React.FC<FormItemSubTitleProps> = (props) => {
  const { children, ...params } = props;
  return (
    <FormItemSubTitleStyleWrapper {...params}>
      {children}
    </FormItemSubTitleStyleWrapper>
  );
};

export default FormItemSubTitle;
