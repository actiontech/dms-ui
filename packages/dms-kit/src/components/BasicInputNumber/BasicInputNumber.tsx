import classnames from 'classnames';
import { BasicInputNumberStyleWrapper } from './style';
import { BasicInputNumberProps } from './BasicInputNumber.types';

const BasicInputNumber: React.FC<BasicInputNumberProps> = (props) => {
  const { className, ...params } = props;

  return (
    <BasicInputNumberStyleWrapper
      size="large"
      className={classnames('basic-inputNumber-wrapper', className)}
      {...params}
    />
  );
};

export default BasicInputNumber;
