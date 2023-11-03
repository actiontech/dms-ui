import { useCallback, useMemo, useRef, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { Form, message, Space, Spin } from 'antd5';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { WechatFormFields } from './index.type';
import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { IWeChatConfigurationResData } from '@actiontech/shared/lib/api/base/service/common';
import { BasicButton, BasicInput, BasicSwitch } from '@actiontech/shared';
import { switchFieldName } from './index.data';
import {
  CustomLabelContent,
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import ConfigSwitch from '../../components/ConfigSwitch';
import ConfigModifyBtn from '../../components/ConfigModifyBtn';
import ConfigTestBtn from '../../components/ConfigTestBtn';
import useConfigSwitch from '../../hooks/useConfigSwitch';
import ConfigTestPopoverForm from '../../components/ConfigTestPopoverForm';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';

const Wechat = () => {
  const { t } = useTranslation();
  const [testForm] = Form.useForm<{ receiveId?: string }>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const {
    data: wechatConfig,
    loading,
    refresh: refreshWechatConfig
  } = useRequest(
    () => dms.GetWeChatConfiguration().then((res) => res?.data?.data),
    {
      onSuccess: (res) => {
        if (res) {
          form.setFieldsValue({
            enable_wechat_notify: !!res.enable_wechat_notify
          });
        }
      }
    }
  );

  const {
    form,
    renderConfigForm,
    modifyFlag,
    startModify,
    modifyFinish,
    extraButtonsVisible,
    enabled
  } = useConfigRender<WechatFormFields>({
    switchFieldName,
    switchFieldLabel: t('dmsSystem.wechat.enable_wechat_notify')
  });

  const isConfigClosed = useMemo(() => {
    return !wechatConfig?.enable_wechat_notify;
  }, [wechatConfig]);

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const submit = (values: WechatFormFields) => {
    startSubmit();
    dms
      .UpdateWeChatConfiguration({
        update_wechat_configuration: {
          enable_wechat_notify: values.enable_wechat_notify,
          corp_id: values.corp_id,
          corp_secret: values.corp_secret,
          agent_id: values.agent_id
            ? Number.parseInt(values.agent_id ?? '0', 10)
            : undefined,
          safe_enabled: values.safe_enabled,
          proxy_ip: values.proxy_ip
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          refreshWechatConfig();
          form.resetFields();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      enable_wechat_notify: wechatConfig?.enable_wechat_notify ?? false,
      corp_id: wechatConfig?.corp_id ?? '',
      agent_id: String(wechatConfig?.agent_id ?? 0),
      safe_enabled: wechatConfig?.safe_enabled ?? false,
      proxy_ip: wechatConfig?.proxy_ip ?? ''
    });
  }, [form, wechatConfig]);

  const handelClickModify = () => {
    setFormDefaultValue();
    startModify();
  };
  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldsValue({ [switchFieldName]: false });
    modifyFinish();
  };

  const handleToggleSwitch = (open: boolean) => {
    form.setFieldValue(switchFieldName, open);
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
    startModify,
    startSubmit,
    submitFinish,
    handleUpdateConfig: () =>
      dms.UpdateWeChatConfiguration({
        update_wechat_configuration: {
          ...wechatConfig,
          enable_wechat_notify: false
        }
      }),
    handleClickCancel,
    refreshConfig: refreshWechatConfig,
    handleToggleSwitch
  });

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

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IWeChatConfigurationResData> =
    useMemo(() => {
      return [
        {
          label: t('dmsSystem.wechat.corp_id'),
          span: 3,
          dataIndex: 'corp_id',
          hidden: !wechatConfig?.enable_wechat_notify
        },
        {
          label: t('dmsSystem.wechat.agent_id'),
          span: 3,
          dataIndex: 'agent_id',
          hidden: !wechatConfig?.enable_wechat_notify
        },
        {
          label: t('dmsSystem.wechat.safe_enabled'),
          span: 3,
          dataIndex: 'safe_enabled',
          render: (val) => <>{!!val ? t('common.open') : t('common.close')}</>,
          hidden: !wechatConfig?.enable_wechat_notify
        },
        {
          label: t('dmsSystem.wechat.proxy_ip'),
          span: 3,
          dataIndex: 'proxy_ip',
          hidden: !wechatConfig?.enable_wechat_notify
        }
      ];
    }, [t, wechatConfig]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={loading || submitLoading}>
        {messageContextHolder}
        {renderConfigForm({
          data: wechatConfig ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <Space size={12} hidden={isConfigClosed || !extraButtonsVisible}>
              <ConfigTestBtn
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
                        <BasicInput />
                      </FormItemLabel>
                    </Form>
                  </ConfigTestPopoverForm>
                }
                testingRef={testTing}
              />
              <ConfigModifyBtn onClick={handelClickModify} />
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
                label={t('dmsSystem.wechat.corp_id')}
                name="corp_id"
                rules={[
                  {
                    required: true
                  }
                ]}
              >
                <BasicInput />
              </FormItemLabel>
              <FormItemLabel
                className="has-required-style"
                label={t('dmsSystem.wechat.agent_id')}
                name="agent_id"
                rules={[
                  {
                    required: true
                  },
                  {
                    pattern: /^\d*$/
                  }
                ]}
              >
                <BasicInput />
              </FormItemLabel>
              <FormItemLabel
                className="has-required-style"
                label={t('dmsSystem.wechat.corp_secret')}
                name="corp_secret"
                rules={[
                  {
                    required: true
                  }
                ]}
              >
                <BasicInput.Password />
              </FormItemLabel>
              <FormItemLabel
                label={t('dmsSystem.wechat.safe_enabled')}
                name="safe_enabled"
                valuePropName="checked"
              >
                <BasicSwitch />
              </FormItemLabel>
              <FormItemLabel
                label={t('dmsSystem.wechat.proxy_ip')}
                name="proxy_ip"
              >
                <BasicInput />
              </FormItemLabel>
            </>
          ),
          submitButtonField: (
            <FormItemNoLabel>
              <Space size={12}>
                <BasicButton
                  disabled={submitLoading}
                  onClick={handleClickCancel}
                >
                  {t('common.cancel')}
                </BasicButton>
                <BasicButton
                  htmlType="submit"
                  type="primary"
                  disabled={submitLoading}
                  loading={submitLoading}
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

export default Wechat;
