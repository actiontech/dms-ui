import { useTranslation } from 'react-i18next';
import { useRef } from 'react';

import { message, Space } from 'antd';
import { BasicToolTips, BasicButton } from '@actiontech/shared';
import ConfigModifyBtn from '../../../components/ConfigModifyBtn';

import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ThunderBoltFilled } from '@actiontech/icons';

export interface ConfigExtraButtonsProps {
  isConfigClosed: boolean;
  extraButtonsVisible: boolean;
  handleClickModify: () => void;
}

const ConfigExtraButtons = ({
  isConfigClosed,
  extraButtonsVisible,
  handleClickModify
}: ConfigExtraButtonsProps) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();

  const testTing = useRef(false);
  const testDingTalkConfiguration = () => {
    if (testTing.current) {
      return;
    }
    testTing.current = true;
    configuration
      .testDingTalkConfigV1()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          if (res.data.data?.is_ding_talk_send_normal) {
            messageApi.success(t('dmsSystem.dingTalk.testSuccess'));
          } else {
            messageApi.error(
              res.data.data?.send_error_message ?? t('common.unknownError')
            );
          }
        }
      })
      .finally(() => {
        testTing.current = false;
      });
  };

  return (
    <>
      {messageContextHolder}
      <Space size={12} hidden={isConfigClosed || !extraButtonsVisible}>
        <BasicToolTips title={t('common.test')} titleWidth={54}>
          <BasicButton
            type="text"
            className="system-config-button"
            loading={testTing.current}
            disabled={testTing.current}
            icon={<ThunderBoltFilled />}
            onClick={testDingTalkConfiguration}
          />
        </BasicToolTips>
        <ConfigModifyBtn onClick={handleClickModify} />
      </Space>
    </>
  );
};

export default ConfigExtraButtons;
