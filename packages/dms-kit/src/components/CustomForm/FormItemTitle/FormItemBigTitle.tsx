import { FormItemBigTitleStyleWrapper } from './style';
import { FormItemBigTitleProps } from './FormItemTitle.types';

const FormItemBigTitle: React.FC<FormItemBigTitleProps> = (props) => {
  const { children, ...params } = props;
  return (
    <FormItemBigTitleStyleWrapper level={3} {...params}>
      {children}
    </FormItemBigTitleStyleWrapper>
  );
};

export default FormItemBigTitle;
