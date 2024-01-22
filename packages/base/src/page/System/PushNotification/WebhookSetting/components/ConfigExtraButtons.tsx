import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { message, Space } from 'antd';

import ConfigModifyBtn from '../../../components/ConfigModifyBtn';
import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { IconTest } from '../../../../../icon/system';

import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';

interface ConfigExtraButtonsProps {
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
      t('dmsSystem.webhook.testing', { url: msgUrl }),
      0
    );
    dms
      .TestWebHookConfiguration()
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
        <BasicToolTips title={t('common.test')} titleWidth={54}>
          <BasicButton
            htmlType="submit"
            type="text"
            className="system-config-button"
            loading={testTing.current}
            disabled={testTing.current}
            icon={<IconTest />}
            onClick={() => {
              if (!enabled) return;
              test();
            }}
          />
        </BasicToolTips>
        <ConfigModifyBtn onClick={handleClickModify} />
      </Space>
    </>
  );
};

export default ConfigExtraButtons;
