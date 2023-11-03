import { useBoolean, useRequest } from 'ahooks';
import { Form, message, Space, Spin } from 'antd5';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { WebhookFormFields } from './index.type';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { IWebHookConfigurationData } from '@actiontech/shared/lib/api/base/service/common';
import { DEFAULT_CONSTANT, switchFieldName } from './index.data';
import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import useConfigSwitch from '../../hooks/useConfigSwitch';
import ConfigSwitch from '../../components/ConfigSwitch';
import ConfigModifyBtn from '../../components/ConfigModifyBtn';
import {
  BasicButton,
  BasicInput,
  BasicInputNumber,
  BasicToolTips
} from '@actiontech/shared';
import { IconTest } from '../../../../icon/system';
import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';

const WebHook: React.FC = () => {
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
  } = useConfigRender<WebhookFormFields>({
    switchFieldName,
    switchFieldLabel: (
      <div className="label-cont-custom">
        <div>{t('dmsSystem.webhook.enableWebhookNotify')}</div>
        <div className="tip-content-box">
          <Link
            to="https://actiontech.github.io/sqle-docs/docs/user-manual/sys-configuration/webhook"
            target="_blank"
            rel="noreferrer"
          >
            {t('dmsSystem.webhook.configDocs')}
          </Link>
        </div>
      </div>
    )
  });

  const {
    data: webhookConfig,
    loading,
    refresh: refreshWebhookConfig
  } = useRequest(
    () => dms.GetWebHookConfiguration().then((res) => res?.data?.data),
    {
      onSuccess(res) {
        if (res) {
          form.setFieldsValue({
            enable: !!res.enable
          });
        }
      }
    }
  );
  const isConfigClosed = useMemo(() => {
    return !webhookConfig?.enable;
  }, [webhookConfig]);

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const submit = (values: WebhookFormFields) => {
    startSubmit();
    const config: IWebHookConfigurationData = {
      enable: values.enable,
      token: values.token,
      max_retry_times: values.maxRetryTimes ?? DEFAULT_CONSTANT.maxRetryTimes,
      retry_interval_seconds:
        values.retryIntervalSeconds ?? DEFAULT_CONSTANT.retryIntervalSeconds,
      url: values.url
    };

    dms
      .UpdateWebHookConfiguration({
        webhook_config: config
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          refreshWebhookConfig();
          form.resetFields();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const handelClickModify = () => {
    form.setFieldsValue({
      enable: !!webhookConfig?.enable,
      token: webhookConfig?.token,
      maxRetryTimes:
        webhookConfig?.max_retry_times ?? DEFAULT_CONSTANT.maxRetryTimes,
      //retry_interval_seconds 后端默认返回 0, 而这个值的范围为 1-5
      retryIntervalSeconds:
        webhookConfig?.retry_interval_seconds ||
        DEFAULT_CONSTANT.retryIntervalSeconds,
      url: webhookConfig?.url
    });
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
      dms.UpdateWebHookConfiguration({
        webhook_config: {
          enable: false
        }
      }),
    handleClickCancel,
    refreshConfig: refreshWebhookConfig,
    handleToggleSwitch
  });

  const testTing = useRef(false);
  const test = () => {
    if (testTing.current) {
      return;
    }

    testTing.current = true;
    const hide = messageApi.loading(
      t('dmsSystem.webhook.testing', { url: webhookConfig?.url ?? '' }),
      0
    );
    dms
      .TestWebHookConfiguration()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const resData = res.data?.data;

          if (resData?.is_message_sent_normally) {
            messageApi.success(t('dmsSystem.webhook.testSuccess'));
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
      });
  };

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IWebHookConfigurationData> =
    useMemo(() => {
      return [
        {
          label: 'Webhook url',
          span: 3,
          dataIndex: 'url',
          hidden: !webhookConfig?.enable
        }
      ];
    }, [webhookConfig]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={loading || submitLoading}>
        {messageContextHolder}

        {renderConfigForm({
          data: webhookConfig ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <Space size={12} hidden={isConfigClosed || !extraButtonsVisible}>
              <BasicToolTips title={t('common.test')} titleWidth={54}>
                <BasicButton
                  htmlType="submit"
                  type="text"
                  className="system-config-button"
                  loading={testTing.current}
                  disabled={testTing.current}
                  icon={<IconTest />}
                  onClick={() => {
                    if (!enabled) return;
                    test();
                  }}
                />
              </BasicToolTips>
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
                label="Webhook url"
                name="url"
                rules={[
                  {
                    required: true,
                    type: 'url'
                  }
                ]}
              >
                <BasicInput />
              </FormItemLabel>
              <FormItemLabel
                className="has-required-style"
                label={t('dmsSystem.webhook.maxRetryTimes')}
                name="maxRetryTimes"
                rules={[
                  {
                    required: true
                  }
                ]}
              >
                <BasicInputNumber min={0} max={5} />
              </FormItemLabel>
              <FormItemLabel
                className="has-required-style"
                label={t('dmsSystem.webhook.retryIntervalSeconds')}
                name="retryIntervalSeconds"
                rules={[
                  {
                    required: true
                  }
                ]}
              >
                <BasicInputNumber min={1} max={5} />
              </FormItemLabel>
              <FormItemLabel label="token" name="token">
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

export default WebHook;
