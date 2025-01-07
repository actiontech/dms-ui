import { Popconfirm } from 'antd';
import { FormItemLabel } from '../../../CustomForm';
import { BasicSwitch, BasicSwitchProps } from '../../../..';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

export interface ConfigSwitchParams extends Omit<BasicSwitchProps, 'onChange'> {
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
  const { t } = useTranslation();
  return (
    <Popconfirm
      title={title}
      open={popoverVisible}
      onOpenChange={onSwitchPopoverOpen}
      onConfirm={onConfirm}
      okText={t('common.ok')}
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
