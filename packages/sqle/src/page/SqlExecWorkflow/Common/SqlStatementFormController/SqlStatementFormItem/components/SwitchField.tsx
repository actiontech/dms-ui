import { BasicSwitch } from '@actiontech/shared';
import { Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { SwitcherFieldProps } from './index.type';

const SwitchField: React.FC<SwitcherFieldProps> = ({
  checked,
  onChange,
  title
}) => {
  const { t } = useTranslation();

  const [
    popconfirmOpen,
    { setTrue: showPopconfirm, setFalse: hidePopconfirm }
  ] = useBoolean();

  return (
    <Popconfirm
      title={title}
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
        className="backup-switcher"
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
