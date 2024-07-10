import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { Form, Spin } from 'antd';

import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import { SMTPSettingFormFields } from './index.type';
import { switchFieldName } from './index.data';

import { ISMTPConfigurationResData } from '@actiontech/shared/lib/api/base/service/common';
import { BasicToolTips } from '@actiontech/shared';

import useConfigSwitch from '../../hooks/useConfigSwitch';
import ConfigSwitch from '../../components/ConfigSwitch';

import ConfigField from './components/ConfigField';
import ConfigExtraButtons from './components/ConfigExtraButtons';

import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import ConfigSubmitButtonField from '../../components/ConfigSubmitButtonField';
import { InfoCircleOutlined } from '@actiontech/icons';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';

const SMTPSetting = () => {
  const { t } = useTranslation();
  const { baseTheme } = useThemeStyleData();

  const {
    form,
    renderConfigForm,
    modifyFlag,
    startModify,
    modifyFinish,
    extraButtonsVisible,
    enabled
  } = useConfigRender<SMTPSettingFormFields>({
    switchFieldName,
    switchFieldLabel: t('dmsSystem.smtp.enable')
  });

  const {
    data: smtpInfo,
    refresh: refreshSMTPInfo,
    loading
  } = useRequest(
    () =>
      Configuration.GetSMTPConfiguration().then((res) => res.data?.data ?? {}),
    {
      onSuccess(res) {
        if (res) {
          form.setFieldsValue({
            enable: !!res.enable_smtp_notify
          });
        }
      }
    }
  );

  const switchOpen = Form.useWatch(switchFieldName, form);

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<ISMTPConfigurationResData> =
    useMemo(() => {
      return [
        {
          label: t('dmsSystem.smtp.host'),
          span: 3,
          dataIndex: 'smtp_host',
          hidden: !smtpInfo?.enable_smtp_notify
        },
        {
          label: t('dmsSystem.smtp.port'),
          span: 3,
          dataIndex: 'smtp_port',
          hidden: !smtpInfo?.enable_smtp_notify
        },
        {
          label: t('dmsSystem.smtp.username'),
          span: 3,
          dataIndex: 'smtp_username',
          hidden: !smtpInfo?.enable_smtp_notify
        },
        {
          label: (
            <BasicToolTips
              title={t('dmsSystem.smtp.skipVerifyTips')}
              suffixIcon={
                <InfoCircleOutlined
                  width={14}
                  height={14}
                  color={baseTheme.icon.system.basicTitleTips}
                />
              }
            >
              {t('dmsSystem.smtp.isSkipVerify')}
            </BasicToolTips>
          ),
          span: 3,
          dataIndex: 'is_skip_verify',
          hidden: !smtpInfo?.enable_smtp_notify,
          render: (val) => <>{!!val ? t('common.true') : t('common.false')}</>
        }
      ];
    }, [t, smtpInfo, baseTheme]);

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const submit = (values: SMTPSettingFormFields) => {
    startSubmit();
    Configuration.UpdateSMTPConfiguration({
      smtp_configuration: {
        enable_smtp_notify: values.enable,
        is_skip_verify: values.isSkipVerify,
        smtp_host: values.host,
        smtp_password: values.password,
        smtp_port: `${values.port}`,
        smtp_username: values.username
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          refreshSMTPInfo();
          form.resetFields();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const isConfigClosed = useMemo(() => {
    return !smtpInfo?.enable_smtp_notify;
  }, [smtpInfo]);

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      host: smtpInfo?.smtp_host,
      port: smtpInfo?.smtp_port
        ? Number.parseInt(smtpInfo.smtp_port, 10)
        : undefined,
      username: smtpInfo?.smtp_username,
      isSkipVerify: smtpInfo?.is_skip_verify ?? false,
      password: undefined,
      passwordConfirm: undefined
    });
  }, [form, smtpInfo]);

  const handleClickModify = useCallback(() => {
    setFormDefaultValue();
    startModify();
  }, [startModify, setFormDefaultValue]);

  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldValue(switchFieldName, false);
    setFormDefaultValue();
    modifyFinish();
  };

  const handleToggleSwitch = (open: boolean) => {
    form.setFieldValue(switchFieldName, open);
  };

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
      Configuration.UpdateSMTPConfiguration({
        smtp_configuration: {
          ...smtpInfo,
          enable_smtp_notify: false
        }
      }),
    handleClickCancel,
    refreshConfig: refreshSMTPInfo,
    handleToggleSwitch
  });

  return (
    <div className="config-form-wrapper">
      <Spin spinning={loading || submitLoading}>
        {renderConfigForm({
          data: smtpInfo ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <ConfigExtraButtons
              isConfigClosed={isConfigClosed}
              enabled={enabled}
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
          submit
        })}
      </Spin>
    </div>
  );
};

export default SMTPSetting;
