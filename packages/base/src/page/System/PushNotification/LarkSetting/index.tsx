import { useBoolean, useRequest } from 'ahooks';
import {
  Form,
  message,
  Radio,
  RadioGroupProps,
  Space,
  Spin,
  Typography
} from 'antd5';
import { useForm } from 'antd5/es/form/Form';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormFields, TestFormFields } from './index.type';
import { BasicButton, BasicInput, EmptyBox } from '@actiontech/shared';
import { phoneRule } from '@actiontech/shared/lib/utils/FormRule';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { TestFeishuConfigurationAccountTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import useConfigSwitch from '../../hooks/useConfigSwitch';
import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import ConfigTestBtn from '../../components/ConfigTestBtn';
import ConfigTestPopoverForm from '../../components/ConfigTestPopoverForm';
import ConfigModifyBtn from '../../components/ConfigModifyBtn';
import ConfigSwitch from '../../components/ConfigSwitch';
import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { IFeishuConfigurationResData } from '@actiontech/shared/lib/api/base/service/common';
import { switchFieldName } from './index.data';

const LarkSetting: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();

  const {
    form,
    renderConfigForm,
    startModify,
    modifyFinish,
    modifyFlag,
    extraButtonsVisible,
    enabled
  } = useConfigRender<FormFields>({
    switchFieldName,
    switchFieldLabel: t('dmsSystem.lark.enable')
  });

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const {
    data: larkInfo,
    loading,
    refresh: refreshLarkInfo
  } = useRequest(
    () => dms.GetFeishuConfiguration().then((res) => res.data?.data ?? {}),
    {
      onSuccess(res) {
        if (res) {
          form.setFieldsValue({
            enabled: !!res.is_feishu_notification_enabled
          });
        }
      }
    }
  );
  const isConfigClosed = useMemo(() => {
    return !larkInfo?.is_feishu_notification_enabled;
  }, [larkInfo]);

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      appKey: larkInfo?.app_id,
      appSecret: undefined
    });
  }, [form, larkInfo]);

  const handleClickModify = () => {
    setFormDefaultValue();
    startModify();
  };
  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldsValue({ [switchFieldName]: false });
    setFormDefaultValue();
    modifyFinish();
  };
  const handleToggleSwitch = (open: boolean) => {
    form.setFieldValue(switchFieldName, open);
  };

  const submitLarkConfig = (values: FormFields) => {
    startSubmit();
    dms
      .UpdateFeishuConfiguration({
        update_feishu_configuration: {
          is_feishu_notification_enabled: values.enabled,
          app_id: values.appKey,
          app_secret: values.appSecret
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          refreshLarkInfo();
          form.resetFields();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const switchOpen = Form.useWatch(switchFieldName, form);

  const {
    configSwitchPopoverVisible,
    onConfigSwitchPopoverOpen,
    onConfigSwitchPopoverConfirm,
    onConfigSwitchChange
  } = useConfigSwitch({
    isConfigClosed,
    switchOpen,
    modifyFlag,
    startSubmit,
    submitFinish,
    handleClickModify,
    handleUpdateConfig: () =>
      dms.UpdateFeishuConfiguration({
        update_feishu_configuration: {
          ...larkInfo,
          is_feishu_notification_enabled: false
        }
      }),
    handleClickCancel,
    refreshConfig: refreshLarkInfo,
    handleToggleSwitch
  });

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
    dms
      .TestFeishuConfiguration({
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
    const receiveType = e.target.value;
    setReceiveType(receiveType);

    if (receiveType === TestFeishuConfigurationAccountTypeEnum.email) {
      testForm.resetFields(['receivePhone']);
    } else {
      testForm.resetFields(['receiveEmail']);
    }
  };

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IFeishuConfigurationResData> =
    useMemo(() => {
      return [
        {
          label: 'App ID',
          span: 3,
          dataIndex: 'app_id',
          hidden: !larkInfo?.is_feishu_notification_enabled,
          render: (val) => (
            <Typography.Paragraph>{val || '--'}</Typography.Paragraph>
          )
        }
      ];
    }, [larkInfo]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={loading || submitLoading}>
        {messageContextHolder}

        {renderConfigForm({
          data: larkInfo ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
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
                    <Form
                      form={testForm}
                      colon={false}
                      {...formItemLayout.fullLine}
                    >
                      <FormItemLabel
                        name="receiveType"
                        label={t('dmsSystem.lark.receiveType')}
                        initialValue={
                          TestFeishuConfigurationAccountTypeEnum.email
                        }
                        style={{ marginBottom: 0 }}
                      >
                        <Radio.Group
                          size="small"
                          onChange={handleChangeReceiveType}
                        >
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
                          receiveType ===
                          TestFeishuConfigurationAccountTypeEnum.phone
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
              <ConfigModifyBtn onClick={handleClickModify} />
            </Space>
          ),
          configSwitchNode: (
            <ConfigSwitch
              switchFieldName={switchFieldName}
              switchOpen={switchOpen}
              modifyFlag={modifyFlag}
              submitLoading={submitLoading}
              popoverVisible={configSwitchPopoverVisible}
              onConfirm={onConfigSwitchPopoverConfirm}
              onSwitchChange={onConfigSwitchChange}
              onSwitchPopoverOpen={onConfigSwitchPopoverOpen}
            />
          ),
          configField: (
            <>
              <FormItemLabel
                className="has-required-style"
                label="App ID"
                name="appKey"
                rules={[{ required: true }]}
              >
                <BasicInput
                  placeholder={t('common.form.placeholder.input', {
                    name: 'App ID'
                  })}
                />
              </FormItemLabel>
              <FormItemLabel
                className="has-required-style"
                label="App Secret"
                name="appSecret"
                rules={[{ required: true }]}
              >
                <BasicInput.Password
                  placeholder={t('common.form.placeholder.input', {
                    name: 'App Secret'
                  })}
                />
              </FormItemLabel>
            </>
          ),
          submitButtonField: (
            <FormItemNoLabel label=" " colon={false}>
              <Space size={12}>
                <BasicButton
                  onClick={handleClickCancel}
                  disabled={submitLoading}
                >
                  {t('common.cancel')}
                </BasicButton>
                <BasicButton
                  htmlType="submit"
                  type="primary"
                  disabled={submitLoading}
                >
                  {t('common.submit')}
                </BasicButton>
              </Space>
            </FormItemNoLabel>
          ),
          submit: submitLarkConfig
        })}
      </Spin>
    </div>
  );
};

export default LarkSetting;
