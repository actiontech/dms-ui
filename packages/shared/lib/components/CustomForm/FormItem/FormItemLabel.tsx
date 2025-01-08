import { FormItemLabelStyleWrapper } from './style';
import { FormItemLabelProps } from './FormItem.types';

const FormItemLabel: React.FC<FormItemLabelProps> = (props) => {
  const { children, ...params } = props;
  return (
    <FormItemLabelStyleWrapper validateFirst {...params}>
      {children}
    </FormItemLabelStyleWrapper>
  );
};

export default FormItemLabel;
