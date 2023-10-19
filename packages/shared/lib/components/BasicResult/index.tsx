import { Result, ResultProps } from 'antd5';
import { BasicResultStyleWrapper } from './style';
import classNames from 'classnames';

const BasicResult: React.FC<ResultProps> = ({ className, ...props }) => {
  return (
    <BasicResultStyleWrapper
      className={classNames(className, 'basic-result-wrapper')}
    >
      <Result {...props} />
    </BasicResultStyleWrapper>
  );
};

export default BasicResult;
