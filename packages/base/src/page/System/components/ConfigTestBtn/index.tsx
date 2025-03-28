import { useTranslation } from 'react-i18next';
import { MutableRefObject } from 'react';
import { Popover } from 'antd';
import { BasicButton, BasicToolTip } from '@actiontech/shared';
import { ThunderBoltFilled } from '@actiontech/icons';

interface ConfigTestBtnParams {
  popoverOpen: boolean;
  onPopoverOpenChange: (open: boolean) => void;
  popoverForm: React.ReactNode;
  testingRef: MutableRefObject<boolean>;
}

/**
 * @deprecated
 * 使用 shared 中 ConfigTestBtn 替换
 */
const ConfigTestBtn: React.FC<ConfigTestBtnParams> = ({
  popoverOpen,
  onPopoverOpenChange,
  popoverForm,
  testingRef
}) => {
  const { t } = useTranslation();
  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      open={popoverOpen}
      onOpenChange={onPopoverOpenChange}
      content={popoverForm}
    >
      <BasicToolTip title={t('common.test')} titleWidth={54}>
        <BasicButton
          type="text"
          className="system-config-button"
          loading={testingRef.current}
          disabled={testingRef.current}
          icon={<ThunderBoltFilled />}
        />
      </BasicToolTip>
    </Popover>
  );
};

export default ConfigTestBtn;
