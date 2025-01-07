import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';

import {
  Form,
  Radio,
  RadioGroupProps,
  Space,
  message as messageApi
} from 'antd';
import { BasicInput, EmptyBox } from '@actiontech/shared';
import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/CustomForm';
import ConfigTestBtn from '../../../components/ConfigTestBtn';
import ConfigTestPopoverForm from '../../../components/ConfigTestPopoverForm';
import ConfigModifyBtn from '../../../components/ConfigModifyBtn';
import { formItemLayout } from '@actiontech/shared/lib/components/CustomForm/style';

import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { TestFeishuConfigurationReqV1AccountTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { phoneRule } from '@actiontech/shared/lib/utils/FormRule';
import { TestFormFields } from '../index.type';
import { ResponseCode } from '@actiontech/shared/lib/enum';

export interface ConfigExtraButtonsProps {
  isConfigClosed: boolean;
  extraButtonsVisible: boolean;
  enabled: string | boolean;
  handleClickModify: () => void;
}

const ConfigExtraButtons = ({
  isConfigClosed,
  extraButtonsVisible,
  enabled,
  handleClickModify
}: ConfigExtraButtonsProps) => {
  const { t } = useTranslation();
  const [message, messageContextHolder] = messageApi.useMessage();

  const [testForm] = Form.useForm<TestFormFields>();
  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);
  const [receiveType, setReceiveType] =
    useState<TestFeishuConfigurationReqV1AccountTypeEnum>(
      TestFeishuConfigurationReqV1AccountTypeEnum.email
    );
  const testing = useRef(false);

  const testLarkAuditConfiguration = async () => {
    if (testing.current) {
      return;
    }
    const values = await testForm.validateFields();

    testing.current = true;
    toggleTestPopoverVisible(false);
    const hide = message.loading(t('dmsSystem.larkAudit.testing'), 0);

    configuration
      .testFeishuAuditConfigV1({
        account:
          receiveType === TestFeishuConfigurationReqV1AccountTypeEnum.email
            ? values.receiveEmail
            : values.receivePhone,
        account_type: values.receiveType
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const resData = res.data?.data;
          if (resData?.is_message_sent_normally) {
            message.success(t('dmsSystem.larkAudit.testSuccess'));
          } else {
            message.error(resData?.error_message ?? t('common.unknownError'));
          }
        }
      })
      .finally(() => {
        hide();
        testing.current = false;
        testForm.resetFields();
        setReceiveType(TestFeishuConfigurationReqV1AccountTypeEnum.email);
      });
  };

  const handleChangeReceiveType: RadioGroupProps['onChange'] = (e) => {
    const type = e.target.value;
    setReceiveType(type);

    if (type === TestFeishuConfigurationReqV1AccountTypeEnum.email) {
      testForm.resetFields(['receivePhone']);
    } else {
      testForm.resetFields(['receiveEmail']);
    }
  };

  const onTestPopoverOpen = (open: boolean) => {
    if (!enabled) {
      return;
    }
    if (!open) {
      testForm.resetFields();
      setReceiveType(TestFeishuConfigurationReqV1AccountTypeEnum.email);
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
              handleTest={testLarkAuditConfiguration}
              handleCancel={() => {
                onTestPopoverOpen(false);
              }}
            >
              <Form form={testForm} colon={false} {...formItemLayout.fullLine}>
                <FormItemLabel
                  name="receiveType"
                  label={t('dmsSystem.larkAudit.receiveType')}
                  initialValue={
                    TestFeishuConfigurationReqV1AccountTypeEnum.email
                  }
                  style={{ marginBottom: 0 }}
                >
                  <Radio.Group size="small" onChange={handleChangeReceiveType}>
                    <Radio.Button
                      value={TestFeishuConfigurationReqV1AccountTypeEnum.email}
                    >
                      {t('dmsSystem.larkAudit.email')}
                    </Radio.Button>
                    <Radio.Button
                      value={TestFeishuConfigurationReqV1AccountTypeEnum.phone}
                    >
                      {t('dmsSystem.larkAudit.phone')}
                    </Radio.Button>
                  </Radio.Group>
                </FormItemLabel>
                <EmptyBox
                  if={
                    receiveType ===
                    TestFeishuConfigurationReqV1AccountTypeEnum.phone
                  }
                  defaultNode={
                    <FormItemNoLabel
                      style={{ marginBottom: 0 }}
                      name="receiveEmail"
                      label={t('dmsSystem.larkAudit.email')}
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
                          name: t('dmsSystem.larkAudit.email')
                        })}
                      />
                    </FormItemNoLabel>
                  }
                >
                  <FormItemNoLabel
                    style={{ marginBottom: 0 }}
                    name="receivePhone"
                    label={t('dmsSystem.larkAudit.phone')}
                    rules={[
                      {
                        required: true
                      },
                      ...phoneRule()
                    ]}
                  >
                    <BasicInput
                      placeholder={t('common.form.placeholder.input', {
                        name: t('dmsSystem.larkAudit.phone')
                      })}
                    />
                  </FormItemNoLabel>
                </EmptyBox>
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
