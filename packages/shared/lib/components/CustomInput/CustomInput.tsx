import { CustomInputStyleWrapper } from './style';
import classNames from 'classnames';
import { CustomInputProps } from './CustomInput.types';

const CustomInput: React.FC<CustomInputProps> = ({
  onCustomPressEnter,
  className,
  ...props
}) => {
  return (
    <CustomInputStyleWrapper
      size="small"
      className={classNames('custom-input-namespace', className)}
      {...props}
      onPressEnter={(event) => {
        onCustomPressEnter((event.target as HTMLInputElement).value ?? '');
      }}
    />
  );
};

export default CustomInput;
