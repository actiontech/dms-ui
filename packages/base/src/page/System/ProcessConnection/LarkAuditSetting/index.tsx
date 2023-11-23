import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form,
  Radio,
  RadioGroupProps,
  Space,
  Spin,
  Typography,
  message as messageApi
} from 'antd';
import { useBoolean, useRequest } from 'ahooks';
import {
  BasicButton,
  BasicInput,
  EmptyBox,
  EnterpriseFeatureDisplay
} from '@actiontech/shared';
import {
  CustomLabelContent,
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import useConfigSwitch from '../../hooks/useConfigSwitch';
import ConfigTestBtn from '../../components/ConfigTestBtn';
import ConfigTestPopoverForm from '../../components/ConfigTestPopoverForm';
import ConfigModifyBtn from '../../components/ConfigModifyBtn';
import ConfigSwitch from '../../components/ConfigSwitch';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { FormFields, TestFormFields } from './index.type';
import { TestFeishuConfigurationReqV1AccountTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { defaultFormData, switchFieldName } from './index.data';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { IFeishuConfigurationV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { phoneRule } from '@actiontech/shared/lib/utils/FormRule';

const LarkAuditSetting: React.FC = () => {
  const { t } = useTranslation();
  const [message, messageContextHolder] = messageApi.useMessage();
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
    switchFieldLabel: (
      <CustomLabelContent
        title={t('dmsSystem.larkAudit.enable')}
        tips={t('dmsSystem.larkAudit.titleTips')}
      />
    )
  });

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const {
    data: larkAuditInfo,
    loading: getLarkAuditInfoLoading,
    refresh: refreshLarkAuditInfo
  } = useRequest(
    () =>
      configuration
        .getFeishuAuditConfigurationV1()
        .then((res) => res.data.data ?? {}),
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
    return !larkAuditInfo?.is_feishu_notification_enabled;
  }, [larkAuditInfo]);

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      appKey: larkAuditInfo?.app_id,
      appSecret: undefined
    });
  }, [form, larkAuditInfo]);

  const handleClickModify = () => {
    setFormDefaultValue();
    startModify();
  };

  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldValue(switchFieldName, false);
    setFormDefaultValue();
    modifyFinish();
  };

  const handleToggleSwitch = (open: boolean) => {
    form.setFieldValue(switchFieldName, open);
  };

  const submitLarkAuditConfig = (values: FormFields) => {
    startSubmit();
    configuration
      .updateFeishuAuditConfigurationV1({
        is_feishu_notification_enabled: values.enabled,
        app_id: values.appKey,
        app_secret: values.appSecret
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          handleClickCancel();
          refreshLarkAuditInfo();
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
      configuration.updateFeishuAuditConfigurationV1({
        ...defaultFormData,
        is_feishu_notification_enabled: false
      }),
    handleClickCancel,
    refreshConfig: refreshLarkAuditInfo,
    handleToggleSwitch
  });

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
    testing.current = true;
    toggleTestPopoverVisible(false);
    const hide = message.loading(t('dmsSystem.larkAudit.testing'), 0);
    const values = await testForm.validateFields();

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
    const receiveType = e.target.value;
    setReceiveType(receiveType);

    if (receiveType === TestFeishuConfigurationReqV1AccountTypeEnum.email) {
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

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IFeishuConfigurationV1> =
    useMemo(() => {
      return [
        {
          label: 'App ID',
          span: 3,
          dataIndex: 'app_id',
          hidden: !larkAuditInfo?.is_feishu_notification_enabled,
          render: (val) => (
            <Typography.Paragraph>{val || '--'}</Typography.Paragraph>
          )
        }
      ];
    }, [larkAuditInfo]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={getLarkAuditInfoLoading || submitLoading}>
        {messageContextHolder}

        <EnterpriseFeatureDisplay
          featureName={t('dmsSystem.title.larkAudit')}
          eeFeatureDescription={t('dmsSystem.larkAudit.ceTips')}
          isConfigPage={true}
        >
          <>
            {renderConfigForm({
              data: larkAuditInfo ?? {},
              columns: readonlyColumnsConfig,
              configExtraButtons: (
                <Space
                  size={12}
                  hidden={isConfigClosed || !extraButtonsVisible}
                >
                  <ConfigTestBtn
                    testingRef={testing}
                    popoverOpen={testPopoverVisible}
                    onPopoverOpenChange={onTestPopoverOpen}
                    popoverForm={
                      <ConfigTestPopoverForm
                        handleTest={testLarkAuditConfiguration}
                        handleCancel={() => toggleTestPopoverVisible(false)}
                      >
                        <Form
                          form={testForm}
                          colon={false}
                          {...formItemLayout.fullLine}
                        >
                          <FormItemLabel
                            name="receiveType"
                            label={t('dmsSystem.larkAudit.receiveType')}
                            initialValue={
                              TestFeishuConfigurationReqV1AccountTypeEnum.email
                            }
                            style={{ marginBottom: 0 }}
                          >
                            <Radio.Group
                              size="small"
                              onChange={handleChangeReceiveType}
                            >
                              <Radio.Button
                                value={
                                  TestFeishuConfigurationReqV1AccountTypeEnum.email
                                }
                              >
                                {t('dmsSystem.larkAudit.email')}
                              </Radio.Button>
                              <Radio.Button
                                value={
                                  TestFeishuConfigurationReqV1AccountTypeEnum.phone
                                }
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
                                <BasicInput />
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
                              <BasicInput />
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
                        name: 'App Key'
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
              submit: submitLarkAuditConfig
            })}
          </>
        </EnterpriseFeatureDisplay>
      </Spin>
    </div>
  );
};

export default LarkAuditSetting;
