import { InputProps } from 'antd';
import { FormInputBotBorderStyleWrapper } from './style';

interface IFormInputBotBorder extends InputProps {}

const FormInputBotBorder = (props: IFormInputBotBorder) => {
  const { children, ...params } = props;
  return (
    <FormInputBotBorderStyleWrapper {...params}>
      {children}
    </FormInputBotBorderStyleWrapper>
  );
};

export default FormInputBotBorder;
