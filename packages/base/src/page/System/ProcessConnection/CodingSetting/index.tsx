import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useMemo } from 'react';
import { Form, Spin, Typography } from 'antd';
import { CustomLabelContent } from '@actiontech/dms-kit';
import ConfigExtraButtons from './components/ConfigExtraButtons';
import ConfigField from './components/ConfigField';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { ICodingConfigurationV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/dms-kit';
import { FormFields } from './index.type';
import { switchFieldName } from './index.data';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import {
  useConfigRender,
  ReadOnlyConfigColumnsType,
  ConfigSwitch,
  ConfigSubmitButtonField,
  useConfigSwitchControls
} from '@actiontech/dms-kit';

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
        title={t('dmsSystem.codingDocking.enable')}
        tips={t('dmsSystem.codingDocking.titleTips')}
      />
    )
  });

  const {
    data: codingInfo,
    loading,
    refresh: refreshCodingInfo
  } = useRequest(
    () =>
      configuration
        .getCodingConfigurationV1()
        .then((res) => res.data.data ?? {}),
    {
      onSuccess(res) {
        if (res) {
          form.setFieldsValue({
            enabled: !!res.is_coding_enabled
          });
        }
      }
    }
  );

  const isConfigClosed = useMemo(() => {
    return !codingInfo?.is_coding_enabled;
  }, [codingInfo]);

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      codingUrl: codingInfo?.coding_url,
      token: undefined
    });
  }, [form, codingInfo]);

  const handleClickModify = () => {
    setFormDefaultValue();
    startModify();
  };
  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldValue(switchFieldName, false);
    setFormDefaultValue();
    modifyFinish();
  };

  const submitCodingConfig = (values: FormFields) => {
    startSubmit();
    configuration
      .UpdateCodingConfigurationV1({
        is_coding_enabled: values.enabled,
        coding_url: values.codingUrl,
        token: values.token
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          form.resetFields();
          refreshCodingInfo();
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
      refreshCodingInfo();
      hiddenConfigSwitchPopover();
    } else {
      startSubmit();
      configuration
        .UpdateCodingConfigurationV1({
          is_coding_enabled: false,
          coding_url: codingInfo?.coding_url
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            handleClickCancel();
            refreshCodingInfo();
          }
        })
        .finally(() => {
          submitFinish();
          hiddenConfigSwitchPopover();
        });
    }
  };

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<ICodingConfigurationV1> =
    useMemo(() => {
      return [
        {
          label: t('dmsSystem.codingDocking.serviceAddress'),
          span: 3,
          dataIndex: 'coding_url',
          hidden: !codingInfo?.is_coding_enabled,
          render: (val) => (
            <Typography.Paragraph>{val || '--'}</Typography.Paragraph>
          )
        }
      ];
    }, [codingInfo, t]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={loading}>
        {renderConfigForm({
          data: codingInfo ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.BASE.SYSTEM.PROCESS_CONNECTION.ENABLE_CODING
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
                PERMISSIONS.ACTIONS.BASE.SYSTEM.PROCESS_CONNECTION.ENABLE_CODING
              }
            >
              <ConfigSwitch
                title={generateConfigSwitchPopoverTitle(modifyFlag)}
                switchFieldName={switchFieldName}
                checked={switchOpen}
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
          onSubmit: submitCodingConfig
        })}
      </Spin>
    </div>
  );
};

export default CodingSetting;
