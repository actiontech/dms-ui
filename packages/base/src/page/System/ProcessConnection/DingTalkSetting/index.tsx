import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useMemo } from 'react';

import { Form, Spin, Typography } from 'antd';
import { CustomLabelContent } from '@actiontech/shared/lib/components/FormCom';
import ConfigSwitch from '../../components/ConfigSwitch';
import ConfigExtraButtons from './components/ConfigExtraButtons';
import ConfigField from './components/ConfigField';

import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import useConfigSwitch from '../../hooks/useConfigSwitch';

import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { IDingTalkConfigurationV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { FormFields } from './index.type';
import { defaultFormData, switchFieldName } from './index.data';
import ConfigSubmitButtonField from '../../components/ConfigSubmitButtonField';

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
        tips={t('system.dingTalk.titleTips')}
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

  const handleToggleSwitch = (open: boolean) => {
    form.setFieldValue(switchFieldName, open);
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
      configuration.updateDingTalkConfigurationV1({
        ...defaultFormData,
        is_enable_ding_talk_notify: false
      }),
    handleClickCancel,
    refreshConfig: refreshDingTalkInfo,
    handleToggleSwitch
  });

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
            <ConfigExtraButtons
              isConfigClosed={isConfigClosed}
              extraButtonsVisible={extraButtonsVisible}
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
          submit: submitDingTalkConfig
        })}
      </Spin>
    </div>
  );
};

export default DingTalkSetting;
