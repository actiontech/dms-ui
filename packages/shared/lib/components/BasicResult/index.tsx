import { Result, ResultProps } from 'antd';
import { BasicResultStyleWrapper } from './style';
import classNames from 'classnames';
import ResultIcon from './ResultIcon';

const BasicResult: React.FC<ResultProps> = ({ className, ...props }) => {
  return (
    <BasicResultStyleWrapper
      className={classNames(className, 'basic-result-wrapper')}
    >
      <Result icon={ResultIcon(props.status)} {...props} />
    </BasicResultStyleWrapper>
  );
};

export default BasicResult;
