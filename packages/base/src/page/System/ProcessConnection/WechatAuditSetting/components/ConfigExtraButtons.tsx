import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { Form, message, Space } from 'antd';
import { BasicInput } from '@actiontech/shared';
import ConfigModifyBtn from '../../../components/ConfigModifyBtn';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import ConfigTestBtn from '../../../components/ConfigTestBtn';
import ConfigTestPopoverForm from '../../../components/ConfigTestPopoverForm';
import { TestFormFields } from '../index.type';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';

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
  const [testForm] = Form.useForm<TestFormFields>();

  const testing = useRef(false);
  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);

  const testWechatAuditConfiguration = async () => {
    if (testing.current) {
      return;
    }
    const values = await testForm.validateFields();

    testing.current = true;
    toggleTestPopoverVisible(false);
    const hide = messageApi.loading(t('dmsSystem.wechatAudit.testing'), 0);

    configuration
      .testWechatAuditConfigV1({ wechat_id: values.wechatUserID })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          if (res.data.data?.is_message_sent_normally) {
            messageApi.success(t('dmsSystem.wechatAudit.testSuccess'));
          } else {
            messageApi.error(
              res.data.data?.error_message ?? t('common.unknownError')
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
              handleTest={testWechatAuditConfiguration}
              handleCancel={() => {
                onTestPopoverOpen(false);
              }}
            >
              <Form form={testForm} colon={false} {...formItemLayout.fullLine}>
                <FormItemLabel
                  name="wechatUserID"
                  label={t('dmsSystem.wechatAudit.wechatUserID')}
                  style={{ marginBottom: 0 }}
                  rules={[{ required: true }]}
                >
                  <BasicInput
                    placeholder={t('common.form.placeholder.input', {
                      name: t('dmsSystem.wechatAudit.wechatUserID')
                    })}
                  />
                </FormItemLabel>
              </Form>
            </ConfigTestPopoverForm>
          }
        />
        <ConfigModifyBtn onClick={handleClickModify} />
      </Space>
    </>
  );
};

export default ConfigExtraButtons;
