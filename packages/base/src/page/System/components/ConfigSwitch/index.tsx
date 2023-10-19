import { Popconfirm } from 'antd5';
import { useTranslation } from 'react-i18next';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { BasicSwitch } from '@actiontech/shared';

interface ConfigSwitchParams {
  switchFieldName: string;
  disabled: boolean;
  popoverVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onSwitchChange: (open: boolean) => void;
}

const ConfigSwitch: React.FC<ConfigSwitchParams> = ({
  switchFieldName,
  disabled,
  popoverVisible,
  onConfirm,
  onCancel,
  onSwitchChange
}) => {
  const { t } = useTranslation();
  return (
    <Popconfirm
      title={t('dmsSystem.cancelConfigConfirm')}
      open={popoverVisible}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <FormItemLabel name={switchFieldName} valuePropName="checked">
        <BasicSwitch disabled={disabled} onChange={onSwitchChange} />
      </FormItemLabel>
    </Popconfirm>
  );
};

export default ConfigSwitch;
