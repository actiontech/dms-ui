import { FormItemProps } from 'antd';
import { FormItemNoLabelStyleWrapper } from './style';

export interface IFormItemNoLabel extends FormItemProps {}

const FormItemNoLabel = (props: IFormItemNoLabel) => {
  const { children, ...params } = props;

  return (
    <FormItemNoLabelStyleWrapper label={<></>} validateFirst {...params}>
      {children}
    </FormItemNoLabelStyleWrapper>
  );
};

export default FormItemNoLabel;
