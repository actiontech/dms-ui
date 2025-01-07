import { FormInputBotBorderProps } from './FormItem.types';
import { FormInputBotBorderStyleWrapper } from './style';

const FormInputBotBorder: React.FC<FormInputBotBorderProps> = (props) => {
  const { children, ...params } = props;
  return (
    <FormInputBotBorderStyleWrapper {...params}>
      {children}
    </FormInputBotBorderStyleWrapper>
  );
};

export default FormInputBotBorder;
