import { CustomInputStyleWrapper } from './style';
import classNames from 'classnames';
import { CustomInputProps } from './CustomInput.types';

const CustomInput: React.FC<CustomInputProps> = ({
  onCustomPressEnter,
  className,
  value,
  ...props
}) => {
  return (
    <CustomInputStyleWrapper
      size="small"
      className={classNames('custom-input-namespace', className)}
      {...props}
      onPressEnter={(event) => {
        onCustomPressEnter(event.target.value ?? '');
      }}
    />
  );
};

export default CustomInput;
