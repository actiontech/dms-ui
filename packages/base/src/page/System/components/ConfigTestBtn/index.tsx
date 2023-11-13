import { MutableRefObject } from 'react';
import { Popover } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { IconTest } from '../../../../icon/system';

interface ConfigTestBtnParams {
  popoverOpen: boolean;
  onPopoverOpenChange: (open: boolean) => void;
  popoverForm: React.ReactNode;
  testingRef: MutableRefObject<boolean>;
}
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
      <BasicToolTips title={t('common.test')} titleWidth={54}>
        <BasicButton
          htmlType="submit"
          type="text"
          className="system-config-button"
          loading={testingRef.current}
          disabled={testingRef.current}
          icon={<IconTest />}
        />
      </BasicToolTips>
    </Popover>
  );
};

export default ConfigTestBtn;
