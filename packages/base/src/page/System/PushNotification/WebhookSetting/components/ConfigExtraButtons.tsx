import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { message, Space } from 'antd';
import { BasicButton, BasicToolTip } from '@actiontech/dms-kit';
import { ConfigModifyBtn } from '@actiontech/dms-kit';
import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { ResponseCode } from '@actiontech/dms-kit';
import { ThunderBoltFilled } from '@actiontech/icons';
export interface ConfigExtraButtonsProps {
  enabled: string | number | boolean;
  isConfigClosed: boolean;
  extraButtonsVisible: boolean;
  handleClickModify: () => void;
  msgUrl: string;
}
const ConfigExtraButtons = ({
  enabled,
  isConfigClosed,
  extraButtonsVisible,
  handleClickModify,
  msgUrl
}: ConfigExtraButtonsProps) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const testTing = useRef(false);
  const test = () => {
    if (testTing.current) {
      return;
    }
    testTing.current = true;
    const hide = messageApi.loading(
      t('dmsSystem.webhook.testing', {
        url: msgUrl
      }),
      0
    );
    Configuration.TestWebHookConfiguration()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const resData = res.data?.data;
          if (resData?.is_message_sent_normally) {
            messageApi.success(t('dmsSystem.webhook.testSuccess'));
          } else {
            messageApi.error(
              resData?.send_error_message ?? t('common.unknownError')
            );
          }
        }
      })
      .finally(() => {
        hide();
        testTing.current = false;
      });
  };
  return (
    <>
      {messageContextHolder}
      <Space size={12} hidden={isConfigClosed || !extraButtonsVisible}>
        <BasicToolTip title={t('common.test')} titleWidth={54}>
          <BasicButton
            type="text"
            className="system-config-button"
            loading={testTing.current}
            disabled={testTing.current}
            icon={<ThunderBoltFilled />}
            onClick={() => {
              if (!enabled) return;
              test();
            }}
          />
        </BasicToolTip>
        <ConfigModifyBtn onClick={handleClickModify} />
      </Space>
    </>
  );
};
export default ConfigExtraButtons;
