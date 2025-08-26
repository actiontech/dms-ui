import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useMemo } from 'react';
import { Form, Spin } from 'antd';
import { DEFAULT_CONSTANT, switchFieldName } from './index.data';
import {
  ConfigSwitch,
  ConfigSubmitButtonField,
  useConfigRender,
  useConfigSwitchControls,
  ReadOnlyConfigColumnsType
} from '@actiontech/dms-kit';
import ConfigExtraButtons from './components/ConfigExtraButtons';
import ConfigField from './components/ConfigField';
import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { IWebHookConfigurationData } from '@actiontech/shared/lib/api/base/service/common';
import { WebhookFormFields } from './index.type';
import { ResponseCode } from '@actiontech/dms-kit';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { TypedLink } from '@actiontech/shared';

const WebHook: React.FC = () => {
  const { t } = useTranslation();

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
          <TypedLink
            to="https://actiontech.github.io/sqle-docs/docs/user-manual/sys-configuration/webhook"
            target="_blank"
            rel="noreferrer"
          >
            {t('dmsSystem.webhook.configDocs')}
          </TypedLink>
        </div>
      </div>
    )
  });

  const {
    data: webhookConfig,
    loading,
    refresh: refreshWebhookConfig
  } = useRequest(
    () =>
      Configuration.GetWebHookConfiguration().then((res) => res?.data?.data),
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

    Configuration.UpdateWebHookConfiguration({
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

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      token: webhookConfig?.token,
      maxRetryTimes:
        webhookConfig?.max_retry_times ?? DEFAULT_CONSTANT.maxRetryTimes,
      //retry_interval_seconds 后端默认返回 0, 而这个值的范围为 1-5
      retryIntervalSeconds:
        webhookConfig?.retry_interval_seconds ||
        DEFAULT_CONSTANT.retryIntervalSeconds,
      url: webhookConfig?.url
    });
  }, [form, webhookConfig]);

  const handleClickModify = () => {
    setFormDefaultValue();
    startModify();
  };

  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldsValue({ [switchFieldName]: false });
    setFormDefaultValue();
    modifyFinish();
  };

  const switchOpen = Form.useWatch(switchFieldName, form);

  const {
    configSwitchPopoverOpenState,
    generateConfigSwitchPopoverTitle,
    onConfigSwitchPopoverOpen,
    handleConfigSwitchChange,
    hiddenConfigSwitchPopover
  } = useConfigSwitchControls(form, switchFieldName);

  const onConfigSwitchPopoverConfirm = () => {
    if (isConfigClosed && modifyFlag) {
      handleClickCancel();
      refreshWebhookConfig();
      hiddenConfigSwitchPopover();
    } else {
      startSubmit();
      Configuration.UpdateWebHookConfiguration({
        webhook_config: {
          ...DEFAULT_CONSTANT,
          enable: false
        }
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            handleClickCancel();
            refreshWebhookConfig();
          }
        })
        .finally(() => {
          submitFinish();
          hiddenConfigSwitchPopover();
        });
    }
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
        {renderConfigForm({
          data: webhookConfig ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.BASE.SYSTEM.PUSH_NOTIFICATION
                  .ENABLE_WEBHOOKS
              }
            >
              <ConfigExtraButtons
                enabled={enabled}
                isConfigClosed={isConfigClosed}
                extraButtonsVisible={extraButtonsVisible}
                handleClickModify={handleClickModify}
                msgUrl={webhookConfig?.url ?? ''}
              />
            </PermissionControl>
          ),
          configSwitchNode: (
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.BASE.SYSTEM.PUSH_NOTIFICATION
                  .ENABLE_WEBHOOKS
              }
            >
              <ConfigSwitch
                title={generateConfigSwitchPopoverTitle(modifyFlag)}
                switchFieldName={switchFieldName}
                checked={switchOpen}
                submitLoading={submitLoading}
                popoverVisible={configSwitchPopoverOpenState}
                onConfirm={onConfigSwitchPopoverConfirm}
                onSwitchChange={(open) =>
                  handleConfigSwitchChange(open, handleClickModify)
                }
                onSwitchPopoverOpen={onConfigSwitchPopoverOpen}
              />
            </PermissionControl>
          ),
          configField: <ConfigField />,
          submitButtonField: (
            <ConfigSubmitButtonField
              submitLoading={submitLoading}
              handleClickCancel={handleClickCancel}
            />
          ),
          onSubmit: submit
        })}
      </Spin>
    </div>
  );
};

export default WebHook;
