import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useMemo } from 'react';
import { Form, Spin, Typography } from 'antd';
import { CustomLabelContent } from '@actiontech/dms-kit';
import {
  ConfigSwitch,
  ConfigSubmitButtonField,
  useConfigRender,
  useConfigSwitchControls,
  ReadOnlyConfigColumnsType
} from '@actiontech/dms-kit';
import ConfigExtraButtons from './components/ConfigExtraButtons';
import ConfigField from './components/ConfigField';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { ResponseCode } from '@actiontech/dms-kit';
import { FormFields } from './index.type';
import { defaultFormData, switchFieldName } from './index.data';
import { IWechatConfigurationV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';

const WechatAuditSetting: React.FC = () => {
  const { t } = useTranslation();
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
        title={t('dmsSystem.wechatAudit.enable')}
        tips={t('dmsSystem.wechatAudit.titleTips')}
      />
    )
  });

  const {
    data: wechatAuditInfo,
    loading,
    refresh: refreshWechatAuditInfo
  } = useRequest(
    () =>
      configuration
        .getWechatAuditConfigurationV1()
        .then((res) => res.data.data ?? {}),
    {
      onSuccess(res) {
        if (res) {
          form.setFieldsValue({
            enabled: !!res.is_wechat_notification_enabled
          });
        }
      }
    }
  );

  const isConfigClosed = useMemo(() => {
    return !wechatAuditInfo?.is_wechat_notification_enabled;
  }, [wechatAuditInfo]);

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      corpID: wechatAuditInfo?.corp_id,
      corpSecret: undefined
    });
  }, [form, wechatAuditInfo]);

  const handleClickModify = () => {
    setFormDefaultValue();
    startModify();
  };
  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldValue(switchFieldName, false);
    setFormDefaultValue();
    modifyFinish();
  };

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const submitWechatAuditConfig = (values: FormFields) => {
    startSubmit();
    configuration
      .updateWechatAuditConfigurationV1({
        is_wechat_notification_enabled: values.enabled,
        corp_id: values.corpID,
        corp_secret: values.corpSecret
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          form.resetFields();
          refreshWechatAuditInfo();
        }
      })
      .finally(() => {
        submitFinish();
      });
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
      refreshWechatAuditInfo();
      hiddenConfigSwitchPopover();
    } else {
      startSubmit();
      configuration
        .updateWechatAuditConfigurationV1({
          ...defaultFormData,
          is_wechat_notification_enabled: false
        })
        .then((res: any) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            handleClickCancel();
            refreshWechatAuditInfo();
          }
        })
        .finally(() => {
          submitFinish();
          hiddenConfigSwitchPopover();
        });
    }
  };

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IWechatConfigurationV1> =
    useMemo(() => {
      return [
        {
          label: t('dmsSystem.wechatAudit.corpID'),
          span: 3,
          dataIndex: 'corp_id',
          hidden: !wechatAuditInfo?.is_wechat_notification_enabled,
          render: (val) => (
            <Typography.Paragraph>{val || '--'}</Typography.Paragraph>
          )
        }
      ];
    }, [t, wechatAuditInfo?.is_wechat_notification_enabled]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={loading}>
        {renderConfigForm({
          data: wechatAuditInfo ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.BASE.SYSTEM.PROCESS_CONNECTION
                  .ENABLE_WECHAT_AUDIT
              }
            >
              <ConfigExtraButtons
                isConfigClosed={isConfigClosed}
                extraButtonsVisible={extraButtonsVisible}
                handleClickModify={handleClickModify}
                enabled={!!enabled}
              />
            </PermissionControl>
          ),
          configSwitchNode: (
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.BASE.SYSTEM.PROCESS_CONNECTION
                  .ENABLE_WECHAT_AUDIT
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
          onSubmit: submitWechatAuditConfig
        })}
      </Spin>
    </div>
  );
};

export default WechatAuditSetting;
