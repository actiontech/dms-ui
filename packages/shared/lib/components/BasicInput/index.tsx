import InternalInput from './Input';
import TextArea from './TextArea';
import { InputProps, InputRef } from 'antd';
import Password from './Password';

type CompoundedComponent = React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<InputRef>
> & {
  TextArea: typeof TextArea;
  Password: typeof Password;
};

const BasicInput = InternalInput as CompoundedComponent;

export { TextArea, Password };

BasicInput.TextArea = TextArea;
BasicInput.Password = Password;

export { BasicInput };
