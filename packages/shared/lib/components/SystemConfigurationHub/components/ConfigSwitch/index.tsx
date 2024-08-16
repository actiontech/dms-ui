import { Popconfirm } from 'antd';
import { FormItemLabel } from '../../../FormCom';
import { BasicSwitch } from '../../../..';
import { IBasicSwitch } from '../../../BasicSwitch';
import classNames from 'classnames';

export interface ConfigSwitchParams extends Omit<IBasicSwitch, 'onChange'> {
  title: string;
  switchFieldName: string;
  submitLoading: boolean;
  popoverVisible: boolean;
  onConfirm: () => void;
  onSwitchChange: (open: boolean) => void;
  onSwitchPopoverOpen: (open: boolean) => void;
}

const ConfigSwitch: React.FC<ConfigSwitchParams> = ({
  title,
  switchFieldName,
  submitLoading,
  popoverVisible,
  onConfirm,
  onSwitchChange,
  onSwitchPopoverOpen,
  ...switchProps
}) => {
  return (
    <Popconfirm
      title={title}
      open={popoverVisible}
      onOpenChange={onSwitchPopoverOpen}
      onConfirm={onConfirm}
    >
      <FormItemLabel name={switchFieldName} valuePropName="checked">
        <BasicSwitch
          {...switchProps}
          className={classNames('system-config-switch', switchProps.className)}
          disabled={submitLoading || switchProps.disabled}
          onChange={onSwitchChange}
        />
      </FormItemLabel>
    </Popconfirm>
  );
};

export default ConfigSwitch;
