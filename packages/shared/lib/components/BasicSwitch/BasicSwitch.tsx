import classnames from 'classnames';
import { BasicSwitchStyleWrapper } from './style';
import { BasicSwitchProps } from './BasicSwitch.types';

const BasicSwitch: React.FC<BasicSwitchProps> = (props) => {
  const { className, ...params } = props;
  return (
    <BasicSwitchStyleWrapper
      className={classnames('basic-switch-wrapper', className)}
      {...params}
    />
  );
};

export default BasicSwitch;
