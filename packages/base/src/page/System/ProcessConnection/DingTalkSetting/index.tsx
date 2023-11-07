import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { Form, message, Space, Spin, Typography } from 'antd5';
import { BasicToolTips, BasicButton, BasicInput } from '@actiontech/shared';
import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { IDingTalkConfigurationV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { FormFields } from './index.type';
import { defaultFormData, switchFieldName } from './index.data';
import useConfigSwitch from '../../hooks/useConfigSwitch';
import {
  CustomLabelContent,
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import ConfigModifyBtn from '../../components/ConfigModifyBtn';
import { IconTest } from '../../../../icon/system';
import ConfigSwitch from '../../components/ConfigSwitch';

const DingTalkSetting: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
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

  const testTing = useRef(false);
  const testDingTalkConfiguration = () => {
    if (testTing.current) {
      return;
    }
    testTing.current = true;
    configuration
      .testDingTalkConfigV1()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          if (res.data.data?.is_ding_talk_send_normal) {
            messageApi.success(t('dmsSystem.dingTalk.testSuccess'));
          } else {
            messageApi.error(
              res.data.data?.send_error_message ?? t('common.unknownError')
            );
          }
        }
      })
      .finally(() => {
        testTing.current = false;
      });
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
        {messageContextHolder}

        {renderConfigForm({
          data: dingTalkInfo ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <Space size={12} hidden={isConfigClosed || !extraButtonsVisible}>
              <BasicToolTips title={t('common.test')} titleWidth={54}>
                <BasicButton
                  htmlType="submit"
                  type="text"
                  className="system-config-button"
                  loading={testTing.current}
                  disabled={testTing.current}
                  icon={<IconTest />}
                  onClick={testDingTalkConfiguration}
                />
              </BasicToolTips>
              <ConfigModifyBtn onClick={handleClickModify} />
            </Space>
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
          configField: (
            <>
              <FormItemLabel
                className="has-required-style"
                label="AppKey"
                name="appKey"
                rules={[{ required: true }]}
              >
                <BasicInput
                  placeholder={t('common.form.placeholder.input', {
                    name: 'AppKey'
                  })}
                />
              </FormItemLabel>
              <FormItemLabel
                className="has-required-style"
                label="AppSecret"
                name="appSecret"
                rules={[{ required: true }]}
              >
                <BasicInput.Password
                  placeholder={t('common.form.placeholder.input', {
                    name: 'AppSecret'
                  })}
                />
              </FormItemLabel>
            </>
          ),
          submitButtonField: (
            <FormItemNoLabel>
              <Space size={12}>
                <BasicButton
                  onClick={handleClickCancel}
                  disabled={submitLoading}
                >
                  {t('common.cancel')}
                </BasicButton>
                <BasicButton
                  htmlType="submit"
                  type="primary"
                  disabled={submitLoading}
                  loading={submitLoading}
                >
                  {t('common.submit')}
                </BasicButton>
              </Space>
            </FormItemNoLabel>
          ),
          submit: submitDingTalkConfig
        })}
      </Spin>
    </div>
  );
};

export default DingTalkSetting;
