import { Popconfirm } from 'antd5';
import { useTranslation } from 'react-i18next';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { BasicSwitch } from '@actiontech/shared';

interface ConfigSwitchParams {
  switchFieldName: string;
  switchOpen?: boolean;
  modifyFlag: boolean;
  popoverVisible: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  onSwitchChange: (open: boolean) => void;
  onSwitchPopoverOpen: (open: boolean) => void;
}

const ConfigSwitch: React.FC<ConfigSwitchParams> = ({
  switchFieldName,
  switchOpen,
  popoverVisible,
  modifyFlag,
  onConfirm,
  onSwitchChange,
  onSwitchPopoverOpen
}) => {
  const { t } = useTranslation();
  return (
    <Popconfirm
      title={
        modifyFlag
          ? t('dmsSystem.resetConfigConfirm')
          : t('dmsSystem.cancelConfigConfirm')
      }
      open={popoverVisible}
      onOpenChange={onSwitchPopoverOpen}
      onConfirm={onConfirm}
    >
      <FormItemLabel name={switchFieldName} valuePropName="checked">
        <BasicSwitch checked={switchOpen} onChange={onSwitchChange} />
      </FormItemLabel>
    </Popconfirm>
  );
};

export default ConfigSwitch;
