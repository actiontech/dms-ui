import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { switchFieldName } from './index.data';
import { Form, Spin } from 'antd';
import {
  ConfigSwitch,
  ConfigSubmitButtonField,
  useConfigRender,
  useConfigSwitchControls,
  ReadOnlyConfigColumnsType
} from '@actiontech/shared/lib/components/SystemConfigurationHub';
import ConfigExtraButtons from './components/ConfigExtraButtons';
import ConfigField from './components/ConfigField';
import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { WechatFormFields } from './index.type';
import { IWeChatConfigurationResData } from '@actiontech/shared/lib/api/base/service/common';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';

const Wechat = () => {
  const { t } = useTranslation();

  const {
    data: wechatConfig,
    loading,
    refresh: refreshWechatConfig
  } = useRequest(
    () => Configuration.GetWeChatConfiguration().then((res) => res?.data?.data),
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

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const submit = (values: WechatFormFields) => {
    startSubmit();
    Configuration.UpdateWeChatConfiguration({
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
      corp_id: wechatConfig?.corp_id ?? '',
      corp_secret: undefined,
      agent_id: String(wechatConfig?.agent_id ?? 0),
      safe_enabled: wechatConfig?.safe_enabled ?? false,
      proxy_ip: wechatConfig?.proxy_ip ?? ''
    });
  }, [form, wechatConfig]);

  const handleClickModify = () => {
    setFormDefaultValue();
    startModify();
  };
  const isConfigClosed = useMemo(() => {
    return !wechatConfig?.enable_wechat_notify;
  }, [wechatConfig]);

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
      refreshWechatConfig();
      hiddenConfigSwitchPopover();
    } else {
      startSubmit();
      Configuration.UpdateWeChatConfiguration({
        update_wechat_configuration: {
          ...wechatConfig,
          enable_wechat_notify: false
        }
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            handleClickCancel();
            refreshWechatConfig();
          }
        })
        .finally(() => {
          submitFinish();
          hiddenConfigSwitchPopover();
        });
    }
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
        {renderConfigForm({
          data: wechatConfig ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.BASE.SYSTEM.PUSH_NOTIFICATION.ENABLE_WECHAT
              }
            >
              <ConfigExtraButtons
                isConfigClosed={isConfigClosed}
                extraButtonsVisible={extraButtonsVisible}
                enabled={enabled}
                handleClickModify={handleClickModify}
              />
            </PermissionControl>
          ),
          configSwitchNode: (
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.BASE.SYSTEM.PUSH_NOTIFICATION.ENABLE_WECHAT
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

export default Wechat;
