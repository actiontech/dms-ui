import { InputProps } from 'antd';
import { CustomInputStyleWrapper } from './style';
import classNames from 'classnames';

export type ICustomInputProps = {
  prefix?: React.ReactNode;
  onCustomPressEnter: (value: string) => any;
} & InputProps;

const CustomInput = ({
  onCustomPressEnter,
  className,
  value,
  ...props
}: ICustomInputProps) => {
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
