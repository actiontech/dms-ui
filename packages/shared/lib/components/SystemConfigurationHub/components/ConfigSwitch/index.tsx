import { Popconfirm } from 'antd';
import { FormItemLabel } from '../../../FormCom';
import { BasicSwitch } from '../../../..';

export interface ConfigSwitchParams {
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
  onSwitchPopoverOpen
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
          className="system-config-switch"
          disabled={submitLoading}
          onChange={onSwitchChange}
        />
      </FormItemLabel>
    </Popconfirm>
  );
};

export default ConfigSwitch;
