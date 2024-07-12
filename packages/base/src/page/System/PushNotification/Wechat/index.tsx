import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';

import { useBoolean, useRequest } from 'ahooks';

import { switchFieldName } from './index.data';
import { Form, Spin } from 'antd';
import ConfigSwitch from '../../components/ConfigSwitch';
import useConfigSwitch from '../../hooks/useConfigSwitch';
import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';

import ConfigExtraButtons from './components/ConfigExtraButtons';
import ConfigField from './components/ConfigField';
import ConfigSubmitButtonField from '../../components/ConfigSubmitButtonField';

import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { WechatFormFields } from './index.type';
import { IWeChatConfigurationResData } from '@actiontech/shared/lib/api/base/service/common';

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
    startSubmit,
    submitFinish,
    handleClickModify,
    handleUpdateConfig: () =>
      Configuration.UpdateWeChatConfiguration({
        update_wechat_configuration: {
          ...wechatConfig,
          enable_wechat_notify: false
        }
      }),
    handleClickCancel,
    refreshConfig: refreshWechatConfig,
    handleToggleSwitch
  });

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
            <ConfigExtraButtons
              isConfigClosed={isConfigClosed}
              extraButtonsVisible={extraButtonsVisible}
              enabled={enabled}
              handleClickModify={handleClickModify}
            />
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
          configField: <ConfigField />,
          submitButtonField: (
            <ConfigSubmitButtonField
              submitLoading={submitLoading}
              handleClickCancel={handleClickCancel}
            />
          ),
          submit
        })}
      </Spin>
    </div>
  );
};

export default Wechat;
