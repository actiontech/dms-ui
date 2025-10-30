import { Result } from 'antd';
import { BasicResultStyleWrapper } from './style';
import classNames from 'classnames';
import ResultIcon from './ResultIcon';
import { BasicResultProps } from './BasicResult.types';
import { omit } from 'lodash';

const BasicResult: React.FC<BasicResultProps> = ({ className, ...props }) => {
  const extraProps = props.status === '404' ? omit(props, 'status') : props;
  return (
    <BasicResultStyleWrapper
      className={classNames(className, 'basic-result-wrapper')}
    >
      <Result icon={ResultIcon(props.status)} {...extraProps} />{' '}
    </BasicResultStyleWrapper>
  );
};

export default BasicResult;
