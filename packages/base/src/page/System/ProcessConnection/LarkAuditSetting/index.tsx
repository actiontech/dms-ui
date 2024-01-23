import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useMemo } from 'react';

import { Form, Spin, Typography, message as messageApi } from 'antd';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import ConfigSwitch from '../../components/ConfigSwitch';
import { CustomLabelContent } from '@actiontech/shared/lib/components/FormCom';
import ConfigField from './components/ConfigField';
import ConfigSubmitButtonField from '../../components/ConfigSubmitButtonField';
import ConfigExtraButtons from './components/ConfigExtraButtons';

import useConfigSwitch from '../../hooks/useConfigSwitch';
import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';

import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { FormFields } from './index.type';
import { defaultFormData, switchFieldName } from './index.data';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IFeishuConfigurationV1 } from '@actiontech/shared/lib/api/sqle/service/common';

const LarkAuditSetting: React.FC = () => {
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
        title={t('dmsSystem.larkAudit.enable')}
        tips={t('dmsSystem.larkAudit.titleTips')}
      />
    )
  });

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const {
    data: larkAuditInfo,
    loading: getLarkAuditInfoLoading,
    refresh: refreshLarkAuditInfo
  } = useRequest(
    () =>
      configuration
        .getFeishuAuditConfigurationV1()
        .then((res) => res.data.data ?? {}),
    {
      onSuccess(res) {
        if (res) {
          form.setFieldsValue({
            enabled: !!res.is_feishu_notification_enabled
          });
        }
      }
    }
  );

  const isConfigClosed = useMemo(() => {
    return !larkAuditInfo?.is_feishu_notification_enabled;
  }, [larkAuditInfo]);

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      appKey: larkAuditInfo?.app_id,
      appSecret: undefined
    });
  }, [form, larkAuditInfo]);

  const handleClickModify = () => {
    setFormDefaultValue();
    startModify();
  };

  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldValue(switchFieldName, false);
    setFormDefaultValue();
    modifyFinish();
  };

  const handleToggleSwitch = (open: boolean) => {
    form.setFieldValue(switchFieldName, open);
  };

  const submitLarkAuditConfig = (values: FormFields) => {
    startSubmit();
    configuration
      .updateFeishuAuditConfigurationV1({
        is_feishu_notification_enabled: values.enabled,
        app_id: values.appKey,
        app_secret: values.appSecret
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          handleClickCancel();
          refreshLarkAuditInfo();
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
      configuration.updateFeishuAuditConfigurationV1({
        ...defaultFormData,
        is_feishu_notification_enabled: false
      }),
    handleClickCancel,
    refreshConfig: refreshLarkAuditInfo,
    handleToggleSwitch
  });

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IFeishuConfigurationV1> =
    useMemo(() => {
      return [
        {
          label: 'App ID',
          span: 3,
          dataIndex: 'app_id',
          hidden: !larkAuditInfo?.is_feishu_notification_enabled,
          render: (val) => (
            <Typography.Paragraph>{val || '--'}</Typography.Paragraph>
          )
        }
      ];
    }, [larkAuditInfo]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={getLarkAuditInfoLoading || submitLoading}>
        <EnterpriseFeatureDisplay
          featureName={t('dmsSystem.title.larkAudit')}
          eeFeatureDescription={
            <Typography.Paragraph className="paragraph">
              {t('dmsSystem.larkAudit.ceTips')}
            </Typography.Paragraph>
          }
          isConfigPage={true}
        >
          <>
            {renderConfigForm({
              data: larkAuditInfo ?? {},
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
              submit: submitLarkAuditConfig
            })}
          </>
        </EnterpriseFeatureDisplay>
      </Spin>
    </div>
  );
};

export default LarkAuditSetting;
