import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useMemo } from 'react';
import { Spin, Typography } from 'antd';
import { CustomLabelContent } from '@actiontech/shared/lib/components/CustomForm';
import ConfigExtraButtons from './components/ConfigExtraButtons';
import ConfigField from './components/ConfigField';
import { ConfigurationService } from '@actiontech/shared/lib/api';
import { IGetSmsConfigurationReplyItem } from '@actiontech/shared/lib/api/base/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { FormFields } from './index.type';
import { switchFieldName } from './index.data';
import {
  useConfigRender,
  ReadOnlyConfigColumnsType,
  ConfigSwitch,
  ConfigSubmitButtonField,
  useConfigSwitchControls
} from '@actiontech/shared';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';

const CodingSetting: React.FC = () => {
  const { t } = useTranslation();

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

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
        title={t('dmsSystem.global.smsSetting.title')}
        tips=""
      />
    )
  });

  const {
    data: smsInfo,
    loading,
    refresh: refreshSmsInfo
  } = useRequest(
    () =>
      ConfigurationService.GetSmsConfiguration().then(
        (res) => res.data.data ?? {}
      ),
    {
      onSuccess(res) {
        if (res) {
          form.setFieldsValue({
            enabled: !!res.enable
          });
        }
      }
    }
  );

  const isConfigClosed = useMemo(() => {
    return !smsInfo?.enable;
  }, [smsInfo]);

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      url: smsInfo?.url,
      token: smsInfo?.configuration?.token
    });
  }, [form, smsInfo]);

  const handleClickModify = () => {
    setFormDefaultValue();
    startModify();
  };
  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldValue(switchFieldName, false);
    setFormDefaultValue();
    modifyFinish();
  };

  const onSubmit = (isCodingEnabled: boolean, values?: FormFields) => {
    startSubmit();
    ConfigurationService.UpdateSmsConfiguration({
      update_sms_configuration: {
        enable_sms: isCodingEnabled,
        url: values?.url,
        configuration: values?.token
          ? {
              token: values?.token ?? ''
            }
          : undefined
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          form.resetFields();
          refreshSmsInfo();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const onConfigSwitchPopoverConfirm = () => {
    if (!smsInfo?.enable && modifyFlag) {
      handleClickCancel();
      hiddenConfigSwitchPopover();
    } else {
      onSubmit(false);
    }
  };

  const {
    configSwitchPopoverOpenState,
    generateConfigSwitchPopoverTitle,
    onConfigSwitchPopoverOpen,
    handleConfigSwitchChange,
    hiddenConfigSwitchPopover
  } = useConfigSwitchControls(form, switchFieldName);

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IGetSmsConfigurationReplyItem> =
    useMemo(() => {
      return [
        {
          label: t('dmsSystem.global.smsSetting.smsType'),
          span: 3,
          dataIndex: 'sms_type',
          hidden: !smsInfo?.enable,
          render: (val) => (
            <Typography.Paragraph>{val || '--'}</Typography.Paragraph>
          )
        },
        {
          label: 'url',
          span: 3,
          dataIndex: 'url',
          hidden: !smsInfo?.enable,
          render: (val) => (
            <Typography.Paragraph>{val || '--'}</Typography.Paragraph>
          )
        }
      ];
    }, [smsInfo, t]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={loading}>
        {renderConfigForm({
          data: smsInfo ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.BASE.SYSTEM.GLOBAL_SETTING.SMS_SERVICE
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
                PERMISSIONS.ACTIONS.BASE.SYSTEM.GLOBAL_SETTING.SMS_SERVICE
              }
            >
              <ConfigSwitch
                title={generateConfigSwitchPopoverTitle(modifyFlag)}
                switchFieldName={switchFieldName}
                submitLoading={submitLoading}
                popoverVisible={configSwitchPopoverOpenState}
                onConfirm={onConfigSwitchPopoverConfirm}
                onSwitchChange={(open) => {
                  handleConfigSwitchChange(open, handleClickModify);
                }}
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
          onSubmit: (values) => {
            onSubmit(enabled, values);
          }
        })}
      </Spin>
    </div>
  );
};

export default CodingSetting;
