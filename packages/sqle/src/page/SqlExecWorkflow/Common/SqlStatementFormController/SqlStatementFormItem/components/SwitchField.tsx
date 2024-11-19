import { BasicSwitch } from '@actiontech/shared';
import { Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';

const SwitchField: React.FC<{
  checked?: boolean;
  onChange?: (v: boolean) => void;
  title?: string;
}> = ({ checked, onChange }) => {
  const { t } = useTranslation();

  const [
    popconfirmOpen,
    { setTrue: showPopconfirm, setFalse: hidePopconfirm }
  ] = useBoolean();

  return (
    <Popconfirm
      title={t('execWorkflow.create.form.sqlInfo.cancelSwitchSqlBackupTips')}
      okText={t('common.ok')}
      placement="topRight"
      open={popconfirmOpen}
      onConfirm={() => {
        onChange?.(false);
        hidePopconfirm();
      }}
      onCancel={hidePopconfirm}
    >
      <BasicSwitch
        checked={checked}
        onChange={() => {
          if (!checked) {
            onChange?.(true);
          } else {
            showPopconfirm();
          }
        }}
      />
    </Popconfirm>
  );
};

export default SwitchField;
