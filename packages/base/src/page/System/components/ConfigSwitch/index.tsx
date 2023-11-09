import { Popconfirm } from 'antd5';
import { useTranslation } from 'react-i18next';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { BasicSwitch } from '@actiontech/shared';

interface ConfigSwitchParams {
  switchFieldName: string;
  switchOpen?: boolean;
  modifyFlag: boolean;
  submitLoading: boolean;
  popoverVisible: boolean;
  onConfirm: () => void;
  onSwitchChange: (open: boolean) => void;
  onSwitchPopoverOpen: (open: boolean) => void;
}

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
          checked={switchOpen}
          disabled={submitLoading}
          onChange={onSwitchChange}
        />
      </FormItemLabel>
    </Popconfirm>
  );
};

export default ConfigSwitch;
