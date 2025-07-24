import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { Form, message, Radio, RadioGroupProps, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { formItemLayout } from '@actiontech/shared/lib/components/CustomForm/style';
import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/CustomForm';
import { BasicInput, EmptyBox } from '@actiontech/shared';
import {
  ConfigModifyBtn,
  ConfigTestBtn,
  ConfigTestPopoverForm
} from '@actiontech/shared/lib/components/SystemConfigurationHub';
import { phoneRule } from '@actiontech/shared/lib/utils/FormRule';

import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { TestFormFields } from '../index.type';
import { TestFeishuConfigurationAccountTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export interface ConfigExtraButtonsProps {
  enabled: string | boolean;
  isConfigClosed: boolean;
  extraButtonsVisible: boolean;
  handleClickModify: () => void;
}

const ConfigExtraButtons = ({
  enabled,
  isConfigClosed,
  extraButtonsVisible,
  handleClickModify
}: ConfigExtraButtonsProps) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);
  const [testForm] = useForm<TestFormFields>();
  const [receiveType, setReceiveType] =
    useState<TestFeishuConfigurationAccountTypeEnum>(
      TestFeishuConfigurationAccountTypeEnum.email
    );

  const testing = useRef(false);
  const testLarkConfiguration = async () => {
    if (testing.current) {
      return;
    }
    const values = await testForm.validateFields();
    testing.current = true;
    toggleTestPopoverVisible(false);
    const hide = messageApi.loading(t('dmsSystem.lark.testing'), 0);
    Configuration.TestFeishuConfiguration({
      test_feishu_configuration: {
        account:
          receiveType === TestFeishuConfigurationAccountTypeEnum.email
            ? values.receiveEmail
            : values.receivePhone,
        account_type: values.receiveType
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const resData = res.data?.data;
          if (resData?.is_message_sent_normally) {
            messageApi.success(t('dmsSystem.lark.testSuccess'));
          } else {
            messageApi.error(
              resData?.error_message ?? t('common.unknownError')
            );
          }
        }
      })
      .finally(() => {
        hide();
        testing.current = false;
        testForm.resetFields();
        setReceiveType(TestFeishuConfigurationAccountTypeEnum.email);
      });
  };

  const onTestPopoverOpen = (open: boolean) => {
    if (!enabled) {
      return;
    }
    if (!open) {
      testForm.resetFields();
      setReceiveType(TestFeishuConfigurationAccountTypeEnum.email);
    }
    toggleTestPopoverVisible(open);
  };

  const handleChangeReceiveType: RadioGroupProps['onChange'] = (e) => {
    const type = e.target.value;
    setReceiveType(type);

    if (type === TestFeishuConfigurationAccountTypeEnum.email) {
      testForm.resetFields(['receivePhone']);
    } else {
      testForm.resetFields(['receiveEmail']);
    }
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
              handleTest={testLarkConfiguration}
              handleCancel={() => toggleTestPopoverVisible(false)}
            >
              <Form form={testForm} colon={false} {...formItemLayout.fullLine}>
                <FormItemLabel
                  name="receiveType"
                  label={t('dmsSystem.lark.receiveType')}
                  initialValue={TestFeishuConfigurationAccountTypeEnum.email}
                  style={{ marginBottom: 0 }}
                >
                  <Radio.Group size="small" onChange={handleChangeReceiveType}>
                    <Radio.Button
                      value={TestFeishuConfigurationAccountTypeEnum.email}
                    >
                      {t('dmsSystem.lark.email')}
                    </Radio.Button>
                    <Radio.Button
                      value={TestFeishuConfigurationAccountTypeEnum.phone}
                    >
                      {t('dmsSystem.lark.phone')}
                    </Radio.Button>
                  </Radio.Group>
                </FormItemLabel>
                <EmptyBox
                  if={
                    receiveType === TestFeishuConfigurationAccountTypeEnum.phone
                  }
                  defaultNode={
                    <FormItemNoLabel
                      style={{ marginBottom: 0 }}
                      name="receiveEmail"
                      rules={[
                        {
                          required: true,
                          message: t('common.form.placeholder.input', {
                            name: t('dmsSystem.lark.email')
                          })
                        },
                        {
                          type: 'email'
                        }
                      ]}
                    >
                      <BasicInput
                        placeholder={t('common.form.placeholder.input', {
                          name: t('dmsSystem.lark.email')
                        })}
                      />
                    </FormItemNoLabel>
                  }
                >
                  <FormItemNoLabel
                    style={{ marginBottom: 0 }}
                    name="receivePhone"
                    rules={[
                      {
                        required: true,
                        message: t('common.form.placeholder.input', {
                          name: t('dmsSystem.lark.phone')
                        })
                      },
                      ...phoneRule()
                    ]}
                  >
                    <BasicInput
                      placeholder={t('common.form.placeholder.input', {
                        name: t('dmsSystem.lark.phone')
                      })}
                    />
                  </FormItemNoLabel>
                </EmptyBox>
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
