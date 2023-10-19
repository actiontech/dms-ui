import { FormItemProps } from 'antd5';
import { FormItemNoLabelStyleWrapper } from './style';

interface IFormItemNoLabel extends FormItemProps {}

const FormItemNoLabel = (props: IFormItemNoLabel) => {
  const { children, ...params } = props;

  return (
    <FormItemNoLabelStyleWrapper label={<></>} validateFirst {...params}>
      {children}
    </FormItemNoLabelStyleWrapper>
  );
};

export default FormItemNoLabel;
