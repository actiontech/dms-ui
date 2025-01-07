import { Result } from 'antd';
import { BasicResultStyleWrapper } from './style';
import classNames from 'classnames';
import ResultIcon from './ResultIcon';
import { BasicResultProps } from './BasicResult.types';

const BasicResult: React.FC<BasicResultProps> = ({ className, ...props }) => {
  return (
    <BasicResultStyleWrapper
      className={classNames(className, 'basic-result-wrapper')}
    >
      <Result icon={ResultIcon(props.status)} {...props} />
    </BasicResultStyleWrapper>
  );
};

export default BasicResult;
