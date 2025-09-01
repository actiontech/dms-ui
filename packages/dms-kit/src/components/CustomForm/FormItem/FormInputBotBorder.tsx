import { FormInputBotBorderProps } from './FormItem.types';
import { FormInputBotBorderStyleWrapper } from './style';

const FormInputBotBorder: React.FC<FormInputBotBorderProps> = (props) => {
  return <FormInputBotBorderStyleWrapper {...props} />;
};

export default FormInputBotBorder;
