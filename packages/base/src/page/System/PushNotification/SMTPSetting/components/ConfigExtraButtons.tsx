import { Form, message, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { formItemLayout } from '@actiontech/shared/lib/components/CustomForm/style';
import { FormItemLabel } from '@actiontech/shared/lib/components/CustomForm';
import { BasicInput } from '@actiontech/shared';
import {
  ConfigModifyBtn,
  ConfigTestBtn,
  ConfigTestPopoverForm
} from '@actiontech/shared/lib/components/SystemConfigurationHub';
import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { ResponseCode } from '@actiontech/shared/lib/enum';

export type typeConfigExtraButtons = {
  isConfigClosed: boolean;
  enabled: string | number | boolean;
  extraButtonsVisible: boolean;
  handleClickModify: () => void;
};

const ConfigExtraButtons = ({
  isConfigClosed,
  enabled,
  extraButtonsVisible,
  handleClickModify
}: typeConfigExtraButtons) => {
  const { t } = useTranslation();

  const [messageApi, messageContextHolder] = message.useMessage();
  const [testForm] = useForm<{ receiveEmail?: string }>();

  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);

  const testTing = useRef(false);

  const onTestPopoverOpen = (open: boolean) => {
    if (!enabled) {
      return;
    }
    if (!open) {
      testForm.resetFields();
    }
    toggleTestPopoverVisible(open);
  };

  const handleTest = async () => {
    if (testTing.current) {
      return;
    }
    const values = await testForm.validateFields();
    testTing.current = true;
    toggleTestPopoverVisible(false);
    const hide = messageApi.loading(
      t('dmsSystem.smtp.testing', {
        email: values.receiveEmail
      }),
      0
    );
    Configuration.TestSMTPConfiguration({
      test_smtp_configuration: {
        recipient_addr: values.receiveEmail
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const resData = res.data?.data;
          if (resData?.is_smtp_send_normal) {
            messageApi.success(
              t('dmsSystem.smtp.testSuccess', { email: values.receiveEmail })
            );
            testForm.resetFields();
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
        testForm.resetFields();
      });
  };

  return (
    <>
      {messageContextHolder}
      <Space size={12} hidden={isConfigClosed || !extraButtonsVisible}>
        <ConfigTestBtn
          testingRef={testTing}
          popoverOpen={testPopoverVisible}
          onPopoverOpenChange={onTestPopoverOpen}
          popoverForm={
            <ConfigTestPopoverForm
              handleTest={handleTest}
              handleCancel={() => toggleTestPopoverVisible(false)}
            >
              <Form form={testForm} colon={false} {...formItemLayout.fullLine}>
                <FormItemLabel
                  className="has-required-style"
                  style={{ marginBottom: 0 }}
                  name="receiveEmail"
                  label={t('dmsSystem.smtp.receiver')}
                  rules={[
                    {
                      required: true
                    },
                    {
                      type: 'email'
                    }
                  ]}
                >
                  <BasicInput
                    placeholder={t('common.form.placeholder.input', {
                      name: t('dmsSystem.smtp.receiver')
                    })}
                  />
                </FormItemLabel>
              </Form>
            </ConfigTestPopoverForm>
          }
        />
        <ConfigModifyBtn
          className="system-config-button"
          onClick={handleClickModify}
        />
      </Space>
    </>
  );
};

export default ConfigExtraButtons;
