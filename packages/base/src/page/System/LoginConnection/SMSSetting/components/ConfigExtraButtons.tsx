import { useTranslation } from 'react-i18next';
import { Space, Form, message } from 'antd';
import { BasicInput } from '@actiontech/dms-kit';
import { FormItemLabel } from '@actiontech/dms-kit';
import { useRef, useState } from 'react';
import baseConfiguration from '@actiontech/shared/lib/api/base/service/Configuration';
import { ResponseCode } from '@actiontech/dms-kit';
import { formItemLayout } from '@actiontech/dms-kit/es/components/CustomForm/style';
import {
  ConfigModifyBtn,
  ConfigTestBtn,
  ConfigTestPopoverForm
} from '@actiontech/dms-kit';
export interface ConfigExtraButtonsProps {
  isConfigClosed: boolean;
  extraButtonsVisible: boolean;
  handleClickModify: () => void;
  enabled: boolean;
}
const ConfigExtraButtons = ({
  isConfigClosed,
  extraButtonsVisible,
  handleClickModify,
  enabled
}: ConfigExtraButtonsProps) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [testForm] = Form.useForm<{
    phone: string;
  }>();
  const testing = useRef(false);
  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);
  const testCodingConfiguration = async () => {
    if (testing.current) {
      return;
    }
    const values = await testForm.validateFields();
    testing.current = true;
    toggleTestPopoverVisible(false);
    const hide = messageApi.loading(
      t('dmsSystem.global.smsSetting.testing'),
      0
    );
    baseConfiguration
      .TestSmsConfiguration({
        test_sms_configuration: {
          recipient_phone: values.phone
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          if (res.data.data?.is_smtp_send_normal) {
            messageApi.success(t('dmsSystem.global.smsSetting.testSuccess'));
          } else {
            messageApi.error(
              res.data.data?.send_error_message ?? t('common.unknownError')
            );
          }
        }
      })
      .finally(() => {
        hide();
        testing.current = false;
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
          testingRef={testing}
          popoverOpen={testPopoverVisible}
          onPopoverOpenChange={onTestPopoverOpen}
          popoverForm={
            <ConfigTestPopoverForm
              handleTest={testCodingConfiguration}
              handleCancel={() => {
                onTestPopoverOpen(false);
              }}
            >
              <Form form={testForm} colon={false} {...formItemLayout.fullLine}>
                <FormItemLabel
                  name="phone"
                  label={t('common.phone')}
                  style={{
                    marginBottom: 0
                  }}
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <BasicInput
                    placeholder={t('common.form.placeholder.input', {
                      name: t('common.phone')
                    })}
                  />
                </FormItemLabel>
              </Form>
            </ConfigTestPopoverForm>
          }
        />
        <ConfigModifyBtn
          className="modify-coding-configuration"
          onClick={handleClickModify}
        />
      </Space>
    </>
  );
};
export default ConfigExtraButtons;
