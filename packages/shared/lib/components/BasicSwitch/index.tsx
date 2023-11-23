import { SwitchProps } from 'antd';
import classnames from 'classnames';
import { BasicSwitchStyleWrapper } from './style';

interface IBasicSwitch extends SwitchProps {}

const BasicSwitch = (props: IBasicSwitch) => {
  const { className, ...params } = props;
  return (
    <BasicSwitchStyleWrapper
      className={classnames('basic-switch-wrapper', className)}
      {...params}
    />
  );
};

export default BasicSwitch;
