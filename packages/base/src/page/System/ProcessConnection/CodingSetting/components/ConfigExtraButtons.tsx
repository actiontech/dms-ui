import { useTranslation } from 'react-i18next';
import { Space, Form, message } from 'antd';
import {
  ConfigTestBtn,
  ConfigTestPopoverForm,
  BasicInput,
  ConfigModifyBtn
} from '@actiontech/shared';
import { FormItemLabel } from '@actiontech/shared/lib/components/CustomForm';
import { useRef, useState } from 'react';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { formItemLayout } from '@actiontech/shared/lib/components/CustomForm/style';

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

  const [testForm] = Form.useForm<any>();

  const testing = useRef(false);
  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);

  const testCodingConfiguration = async () => {
    if (testing.current) {
      return;
    }
    const values = await testForm.validateFields();

    testing.current = true;
    toggleTestPopoverVisible(false);
    const hide = messageApi.loading(t('dmsSystem.codingDocking.testing'), 0);
    configuration
      .testCodingConfigV1({ coding_project_name: values.codingProjectName })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          if (res.data.data?.is_message_sent_normally) {
            messageApi.success(t('dmsSystem.codingDocking.testSuccess'));
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
              handleTest={testCodingConfiguration}
              handleCancel={() => {
                onTestPopoverOpen(false);
              }}
            >
              <Form form={testForm} colon={false} {...formItemLayout.fullLine}>
                <FormItemLabel
                  name="codingProjectName"
                  label={t('dmsSystem.codingDocking.codingProjectName')}
                  style={{ marginBottom: 0 }}
                  rules={[{ required: true }]}
                >
                  <BasicInput
                    placeholder={t('common.form.placeholder.input', {
                      name: t('dmsSystem.codingDocking.codingProjectName')
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
