import { FormItemNoLabelStyleWrapper } from './style';
import { FormItemNoLabelProps } from './FormItem.types';

const FormItemNoLabel: React.FC<FormItemNoLabelProps> = (props) => {
  const { children, ...params } = props;

  return (
    <FormItemNoLabelStyleWrapper label={<></>} validateFirst {...params}>
      {children}
    </FormItemNoLabelStyleWrapper>
  );
};

export default FormItemNoLabel;
