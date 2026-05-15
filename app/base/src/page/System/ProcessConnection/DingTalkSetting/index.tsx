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
import ConfigField from './components/ConfigField';
import ConfigExtraButtons from './components/ConfigExtraButtons';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { IDingTalkConfigurationV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/dms-kit';
import { FormFields } from './index.type';
import { defaultFormData, switchFieldName } from './index.data';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';

const DingTalkSetting: React.FC = () => {
  const { t } = useTranslation();
  const {
    form,
    renderConfigForm,
    startModify,
    modifyFinish,
    modifyFlag,
    extraButtonsVisible
  } = useConfigRender<FormFields>({
    switchFieldName,
    switchFieldLabel: (
      <CustomLabelContent
        title={t('dmsSystem.dingTalk.enable')}
        tips={t('dmsSystem.dingTalk.titleTips')}
      />
    )
  });

  const {
    data: dingTalkInfo,
    loading,
    refresh: refreshDingTalkInfo
  } = useRequest(
    () =>
      configuration
        .getDingTalkConfigurationV1()
        .then((res) => res.data.data ?? {}),
    {
      onSuccess(res) {
        if (res) {
          form.setFieldsValue({
            enabled: !!res.is_enable_ding_talk_notify
          });
        }
      }
    }
  );

  const isConfigClosed = useMemo(() => {
    return !dingTalkInfo?.is_enable_ding_talk_notify;
  }, [dingTalkInfo]);

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      appKey: dingTalkInfo?.app_key,
      appSecret: undefined
    });
  }, [form, dingTalkInfo]);

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
  const submitDingTalkConfig = (values: FormFields) => {
    startSubmit();
    configuration
      .updateDingTalkConfigurationV1({
        is_enable_ding_talk_notify: values.enabled,
        app_key: values.appKey,
        app_secret: values.appSecret
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          form.resetFields();
          refreshDingTalkInfo();
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
      refreshDingTalkInfo();
      hiddenConfigSwitchPopover();
    } else {
      startSubmit();
      configuration
        .updateDingTalkConfigurationV1({
          ...defaultFormData,
          is_enable_ding_talk_notify: false
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            handleClickCancel();
            refreshDingTalkInfo();
          }
        })
        .finally(() => {
          submitFinish();
          hiddenConfigSwitchPopover();
        });
    }
  };

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IDingTalkConfigurationV1> =
    useMemo(() => {
      return [
        {
          label: 'AppKey',
          span: 3,
          dataIndex: 'app_key',
          hidden: !dingTalkInfo?.is_enable_ding_talk_notify,
          render: (val) => (
            <Typography.Paragraph>{val || '--'}</Typography.Paragraph>
          )
        }
      ];
    }, [dingTalkInfo]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={loading}>
        {renderConfigForm({
          data: dingTalkInfo ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.BASE.SYSTEM.PROCESS_CONNECTION
                  .ENABLE_DING_TALK
              }
            >
              <ConfigExtraButtons
                isConfigClosed={isConfigClosed}
                extraButtonsVisible={extraButtonsVisible}
                handleClickModify={handleClickModify}
              />
            </PermissionControl>
          ),
          configSwitchNode: (
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.BASE.SYSTEM.PROCESS_CONNECTION
                  .ENABLE_DING_TALK
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
          onSubmit: submitDingTalkConfig
        })}
      </Spin>
    </div>
  );
};

export default DingTalkSetting;
