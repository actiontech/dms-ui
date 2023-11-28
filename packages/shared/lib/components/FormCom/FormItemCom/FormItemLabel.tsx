import { FormItemProps } from 'antd';
import { FormItemLabelStyleWrapper } from './style';

export interface IFormItemLabel extends FormItemProps {}

const FormItemLabel = (props: IFormItemLabel) => {
  const { children, ...params } = props;
  return (
    <FormItemLabelStyleWrapper validateFirst {...params}>
      {children}
    </FormItemLabelStyleWrapper>
  );
};

export default FormItemLabel;
