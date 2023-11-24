import { useCallback, useMemo, useRef, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { Form, message, Space, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { SMTPSettingFormFields } from './index.type';
import {
  BasicButton,
  BasicInput,
  BasicSwitch,
  BasicToolTips
} from '@actiontech/shared';
import { IconTipGray } from '@actiontech/shared/lib/Icon';
import { validatorPort } from '@actiontech/shared/lib/utils/FormRule';
import {
  CustomLabelContent,
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { ISMTPConfigurationResData } from '@actiontech/shared/lib/api/base/service/common';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import { switchFieldName } from './index.data';
import ConfigModifyBtn from '../../components/ConfigModifyBtn';
import ConfigTestBtn from '../../components/ConfigTestBtn';
import ConfigSwitch from '../../components/ConfigSwitch';
import useConfigSwitch from '../../hooks/useConfigSwitch';
import ConfigTestPopoverForm from '../../components/ConfigTestPopoverForm';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';

const SMTPSetting = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();

  const {
    form,
    renderConfigForm,
    modifyFlag,
    startModify,
    modifyFinish,
    extraButtonsVisible,
    enabled
  } = useConfigRender<SMTPSettingFormFields>({
    switchFieldName,
    switchFieldLabel: t('dmsSystem.smtp.enable')
  });

  const {
    data: smtpInfo,
    refresh: refreshSMTPInfo,
    loading
  } = useRequest(
    () => dms.GetSMTPConfiguration().then((res) => res.data?.data ?? {}),
    {
      onSuccess(res) {
        if (res) {
          form.setFieldsValue({
            enable: !!res.enable_smtp_notify
          });
        }
      }
    }
  );

  const isConfigClosed = useMemo(() => {
    return !smtpInfo?.enable_smtp_notify;
  }, [smtpInfo]);

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      host: smtpInfo?.smtp_host,
      port: smtpInfo?.smtp_port
        ? Number.parseInt(smtpInfo.smtp_port, 10)
        : undefined,
      username: smtpInfo?.smtp_username,
      isSkipVerify: smtpInfo?.is_skip_verify ?? false,
      password: undefined,
      passwordConfirm: undefined
    });
  }, [form, smtpInfo]);

  const handleClickModify = useCallback(() => {
    setFormDefaultValue();
    startModify();
  }, [startModify, setFormDefaultValue]);
  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldValue(switchFieldName, false);
    setFormDefaultValue();
    modifyFinish();
  };

  const handleToggleSwitch = (open: boolean) => {
    form.setFieldValue(switchFieldName, open);
  };

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const submit = (values: SMTPSettingFormFields) => {
    startSubmit();
    dms
      .UpdateSMTPConfiguration({
        smtp_configuration: {
          enable_smtp_notify: values.enable,
          is_skip_verify: values.isSkipVerify,
          smtp_host: values.host,
          smtp_password: values.password,
          smtp_port: `${values.port}`,
          smtp_username: values.username
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          refreshSMTPInfo();
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
      dms.UpdateSMTPConfiguration({
        smtp_configuration: {
          ...smtpInfo,
          enable_smtp_notify: false
        }
      }),
    handleClickCancel,
    refreshConfig: refreshSMTPInfo,
    handleToggleSwitch
  });

  const [testPopoverVisible, toggleTestPopoverVisible] = useState(false);
  const [testForm] = useForm<{ receiveEmail?: string }>();
  const testTing = useRef(false);
  const test = async () => {
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
    dms
      .TestSMTPConfiguration({
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
  const onTestPopoverOpen = (open: boolean) => {
    if (!enabled) {
      return;
    }
    if (!open) {
      testForm.resetFields();
    }
    toggleTestPopoverVisible(open);
  };

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<ISMTPConfigurationResData> =
    useMemo(() => {
      return [
        {
          label: t('dmsSystem.smtp.host'),
          span: 3,
          dataIndex: 'smtp_host',
          hidden: !smtpInfo?.enable_smtp_notify
        },
        {
          label: t('dmsSystem.smtp.port'),
          span: 3,
          dataIndex: 'smtp_port',
          hidden: !smtpInfo?.enable_smtp_notify
        },
        {
          label: t('dmsSystem.smtp.username'),
          span: 3,
          dataIndex: 'smtp_username',
          hidden: !smtpInfo?.enable_smtp_notify
        },
        {
          label: (
            <BasicToolTips
              title={t('dmsSystem.smtp.skipVerifyTips')}
              suffixIcon={<IconTipGray />}
            >
              {t('dmsSystem.smtp.isSkipVerify')}
            </BasicToolTips>
          ),
          span: 3,
          dataIndex: 'is_skip_verify',
          hidden: !smtpInfo?.enable_smtp_notify,
          render: (val) => <>{!!val ? t('common.true') : t('common.false')}</>
        }
      ];
    }, [t, smtpInfo]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={loading || submitLoading}>
        {messageContextHolder}

        {renderConfigForm({
          data: smtpInfo ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <Space size={12} hidden={isConfigClosed || !extraButtonsVisible}>
              <ConfigTestBtn
                testingRef={testTing}
                popoverOpen={testPopoverVisible}
                onPopoverOpenChange={onTestPopoverOpen}
                popoverForm={
                  <ConfigTestPopoverForm
                    handleTest={test}
                    handleCancel={() => toggleTestPopoverVisible(false)}
                  >
                    <Form
                      form={testForm}
                      colon={false}
                      {...formItemLayout.fullLine}
                    >
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
                        <BasicInput />
                      </FormItemLabel>
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
                className="has-label-tip"
                label={
                  <CustomLabelContent
                    title={t('dmsSystem.smtp.isSkipVerify')}
                    tips={t('dmsSystem.smtp.skipVerifyTips')}
                  />
                }
                name="isSkipVerify"
                valuePropName="checked"
              >
                <BasicSwitch />
              </FormItemLabel>
              <FormItemLabel
                className="has-required-style"
                label={t('dmsSystem.smtp.host')}
                name="host"
                rules={[
                  {
                    required: true
                  }
                ]}
              >
                <BasicInput placeholder={t('common.form.placeholder.input')} />
              </FormItemLabel>
              <FormItemLabel
                className="has-required-style"
                label={t('dmsSystem.smtp.port')}
                name="port"
                rules={[
                  {
                    required: true
                  },
                  {
                    validator: validatorPort()
                  }
                ]}
              >
                <BasicInput placeholder={t('common.form.placeholder.input')} />
              </FormItemLabel>
              <FormItemLabel
                className="has-required-style"
                label={t('dmsSystem.smtp.username')}
                name="username"
                rules={[
                  {
                    required: true
                  },
                  {
                    type: 'email'
                  }
                ]}
              >
                <BasicInput placeholder={t('common.form.placeholder.input')} />
              </FormItemLabel>

              <FormItemLabel
                className="has-required-style"
                label={t('dmsSystem.smtp.password')}
                name="password"
                rules={[
                  {
                    required: true
                  }
                ]}
              >
                <BasicInput.Password
                  placeholder={t('common.form.placeholder.input')}
                />
              </FormItemLabel>
              <FormItemLabel
                className="has-required-style"
                label={t('dmsSystem.smtp.passwordConfirm')}
                name="passwordConfirm"
                dependencies={['password']}
                rules={[
                  {
                    required: true
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t('common.form.rule.passwordNotMatch'))
                      );
                    }
                  })
                ]}
              >
                <BasicInput.Password
                  placeholder={t('common.form.placeholder.input')}
                />
              </FormItemLabel>
            </>
          ),
          submitButtonField: (
            <FormItemNoLabel>
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
          submit
        })}
      </Spin>
    </div>
  );
};

export default SMTPSetting;
