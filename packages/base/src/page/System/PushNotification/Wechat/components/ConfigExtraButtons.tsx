import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';

import { Form, message, Space } from 'antd';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/FormCom';
import ConfigModifyBtn from '../../../components/ConfigModifyBtn';
import ConfigTestBtn from '../../../components/ConfigTestBtn';
import ConfigTestPopoverForm from '../../../components/ConfigTestPopoverForm';
import { BasicInput } from '@actiontech/shared';

import dms from '@actiontech/shared/lib/api/base/service/dms';

export type typeConfigExtraButtons = {
  extraButtonsVisible: boolean;
  isConfigClosed: boolean;
  enabled: string | boolean | undefined;
  handleClickModify: () => void;
};

const ConfigExtraButtons = ({
  extraButtonsVisible,
  isConfigClosed,
  enabled,
  handleClickModify
}: typeConfigExtraButtons) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [testForm] = Form.useForm<{ receiveId?: string }>();

  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);
  const testTing = useRef(false);
  const test = async () => {
    if (testTing.current) {
      return;
    }
    const values = await testForm.validateFields();

    testTing.current = true;
    toggleTestPopoverVisible(false);
    const hide = messageApi.loading(
      t('dmsSystem.wechat.testing', { id: values.receiveId }),
      0
    );
    dms
      .TestWeChatConfiguration({
        test_wechat_configuration: {
          recipient_id: values.receiveId
        }
      })
      .then((res) => {
        const resData = res.data?.data;
        if (resData?.is_wechat_send_normal) {
          messageApi.success(t('dmsSystem.wechat.testSuccess'));
        } else {
          messageApi.error(
            resData?.send_error_message ?? t('common.unknownError')
          );
        }
      })
      .finally(() => {
        hide();
        testTing.current = false;
        testForm.resetFields();
      });
  };

  const onTestPopoverOpen = (open: boolean) => {
    if (!enabled) {
      return;
    }
    if (!open) {
      testForm.resetFields();
    }
    toggleTestPopoverVisible(open);
  };

  return (
    <>
      {messageContextHolder}
      <Space size={12} hidden={isConfigClosed || !extraButtonsVisible}>
        <ConfigTestBtn
          popoverOpen={testPopoverVisible}
          onPopoverOpenChange={onTestPopoverOpen}
          popoverForm={
            <ConfigTestPopoverForm
              handleTest={test}
              handleCancel={() => toggleTestPopoverVisible(false)}
            >
              <Form form={testForm} colon={false} {...formItemLayout.fullLine}>
                <FormItemLabel
                  className="has-required-style has-label-tip"
                  label={
                    <CustomLabelContent
                      title={t('dmsSystem.wechat.receiveWechat')}
                      tips={t('dmsSystem.wechat.receiveWechatTips')}
                    />
                  }
                  style={{ marginBottom: 0 }}
                  name="receiveId"
                  rules={[
                    {
                      required: true,
                      message: t('common.form.placeholder.input', {
                        name: t('dmsSystem.wechat.receiveWechat')
                      })
                    }
                  ]}
                >
                  <BasicInput
                    placeholder={t('common.form.placeholder.input', {
                      name: t('dmsSystem.wechat.receiveWechat')
                    })}
                  />
                </FormItemLabel>
              </Form>
            </ConfigTestPopoverForm>
          }
          testingRef={testTing}
        />
        <ConfigModifyBtn onClick={handleClickModify} />
      </Space>
    </>
  );
};

export default ConfigExtraButtons;
