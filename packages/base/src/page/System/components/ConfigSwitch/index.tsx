import { Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { FormItemLabel } from '@actiontech/shared/lib/components/CustomForm';
import { BasicSwitch } from '@actiontech/shared';

export interface ConfigSwitchParams {
  switchFieldName: string;
  switchOpen?: boolean;
  modifyFlag: boolean;
  submitLoading: boolean;
  popoverVisible: boolean;
  onConfirm: () => void;
  onSwitchChange: (open: boolean) => void;
  onSwitchPopoverOpen: (open: boolean) => void;
}

/**
 * @deprecated
 * 使用 shared 中 ConfigSwitch 替换
 */
const ConfigSwitch: React.FC<ConfigSwitchParams> = ({
  switchFieldName,
  switchOpen,
  modifyFlag,
  submitLoading,
  popoverVisible,
  onConfirm,
  onSwitchChange,
  onSwitchPopoverOpen
}) => {
  const { t } = useTranslation();

  return (
    <Popconfirm
      title={
        modifyFlag
          ? t('dmsSystem.confirmResetConfigTips')
          : t('dmsSystem.confirmCloseConfigTips')
      }
      open={popoverVisible}
      onOpenChange={onSwitchPopoverOpen}
      onConfirm={onConfirm}
    >
      <FormItemLabel name={switchFieldName} valuePropName="checked">
        <BasicSwitch
          className="system-config-switch"
          checked={switchOpen}
          disabled={submitLoading}
          onChange={onSwitchChange}
        />
      </FormItemLabel>
    </Popconfirm>
  );
};

export default ConfigSwitch;
