import { BasicSwitch } from '@actiontech/shared';
import { Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

type ConfirmSwitchProps = {
  checked?: boolean;
  onChange?: (value: boolean) => void;
  onConfirm?: () => void;
};

const ConfirmSwitch: React.FC<ConfirmSwitchProps> = ({
  checked,
  onChange,
  onConfirm
}) => {
  const { t } = useTranslation();

  const [auditRequiredPopupVisible, setAuditRequiredPopupVisible] =
    useState<boolean>(false);

  const onOpenChange = (open: boolean) => {
    if (!checked) {
      return;
    }
    setAuditRequiredPopupVisible(open);
  };

  const onSwitchChange = (value: boolean) => {
    if (value) {
      onChange?.(value);
    }
  };

  const onInnerConfirm = () => {
    onChange?.(false);
    onConfirm?.();
  };

  return (
    <Popconfirm
      title={t('dmsDataSource.dataSourceForm.closeAuditSqlServiceTips')}
      overlayClassName="popconfirm-small"
      open={auditRequiredPopupVisible}
      onOpenChange={onOpenChange}
      onConfirm={onInnerConfirm}
    >
      <BasicSwitch
        className="audit-confirm-switch"
        checked={checked}
        onChange={onSwitchChange}
      />
    </Popconfirm>
  );
};

export default ConfirmSwitch;
