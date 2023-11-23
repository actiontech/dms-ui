import { FormItemProps } from 'antd';
import { FormItemLabelStyleWrapper } from './style';

interface IFormItemLabel extends FormItemProps {}

const FormItemLabel = (props: IFormItemLabel) => {
  const { children, ...params } = props;
  return (
    <FormItemLabelStyleWrapper validateFirst {...params}>
      {children}
    </FormItemLabelStyleWrapper>
  );
};

export default FormItemLabel;
