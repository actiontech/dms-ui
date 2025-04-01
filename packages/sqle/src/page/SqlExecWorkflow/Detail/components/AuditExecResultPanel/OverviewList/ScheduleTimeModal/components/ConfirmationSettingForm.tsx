import { Form, Spin } from 'antd';
import { ConfirmationSettingFormProps } from './index.type';
import { useBoolean, useRequest } from 'ahooks';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/CustomForm';
import {
  BasicSwitch,
  EmptyBox,
  ToggleTokens,
  ToggleTokensOptionsType,
  TypedLink
} from '@actiontech/shared';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { UpdateWorkflowScheduleReqV2NotifyTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ConfirmMethodFormItemLabelStyleWrapper } from './style';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { SupportLanguage } from '@actiontech/shared/lib/enum';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const ConfirmationSettingForm: React.FC<ConfirmationSettingFormProps> = ({
  enable,
  setSubmitButtonDisabled,
  confirmTypeTokens,
  setConfirmTypeTokens
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();

  const [
    getConfigLoading,
    { setFalse: getConfigFinish, setTrue: startGetConfig }
  ] = useBoolean(false);

  const { language } = useCurrentUser();

  const { loading: getDefaultSelectorLoading, run: getDefaultSelector } =
    useRequest(
      (enableConfirmList: ToggleTokensOptionsType) =>
        workflow.getScheduledTaskDefaultOptionV1().then((res) => {
          const defaultSelector = res.data.data?.default_selector;
          if (
            defaultSelector &&
            enableConfirmList.some((item) => {
              if (typeof item === 'string') {
                return item === defaultSelector;
              }
              return item.value === defaultSelector;
            })
          ) {
            form.setFieldValue('confirmation_method', defaultSelector);
          }
        }),
      {
        manual: true
      }
    );

  useEffect(() => {
    if (enable) {
      startGetConfig();
      Promise.all([
        configuration.getFeishuAuditConfigurationV1(),
        configuration.getWechatAuditConfigurationV1()
      ])
        .then((res) => {
          const [enableFeishu, enableWechat] = [
            res[0].data.data?.is_feishu_notification_enabled,
            res[1].data.data?.is_wechat_notification_enabled
          ];
          const list: ToggleTokensOptionsType = [];
          if (enableWechat) {
            list.push({
              label: t('execWorkflow.detail.operator.confirmMethodWechat'),
              value: UpdateWorkflowScheduleReqV2NotifyTypeEnum.wechat
            });
          }

          if (enableFeishu) {
            list.push({
              label: t('execWorkflow.detail.operator.confirmMethodFeishu'),
              value: UpdateWorkflowScheduleReqV2NotifyTypeEnum.feishu
            });
          }

          if (list.length === 0) {
            setSubmitButtonDisabled(true);
          } else {
            getDefaultSelector(list);
          }

          setConfirmTypeTokens(list);
        })
        .catch(() => {
          setSubmitButtonDisabled(true);
        })
        .finally(() => {
          getConfigFinish();
        });
    } else {
      setSubmitButtonDisabled(false);
    }
  }, [
    enable,
    getConfigFinish,
    getDefaultSelector,
    setConfirmTypeTokens,
    setSubmitButtonDisabled,
    startGetConfig,
    t
  ]);

  return (
    <Spin spinning={getConfigLoading || getDefaultSelectorLoading} delay={400}>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t(
              'execWorkflow.detail.operator.scheduleTimeExecuteConfirmLabel'
            )}
            tips={t(
              'execWorkflow.detail.operator.scheduleTimeExecuteConfirmTips'
            )}
          />
        }
        name="notification_confirmation"
        labelCol={{ span: 20 }}
        wrapperCol={{ span: 2, push: 1 }}
        valuePropName="checked"
      >
        <BasicSwitch />
      </FormItemLabel>
      <EmptyBox if={enable}>
        <ConfirmMethodFormItemLabelStyleWrapper
          className="has-label-tip has-required-style"
          label={
            <CustomLabelContent
              title={t(
                'execWorkflow.detail.operator.scheduleTimeExecuteConfirmMethod'
              )}
              tips={
                <Trans
                  i18nKey={
                    'execWorkflow.detail.operator.scheduleTimeExecuteConfirmMethodTips'
                  }
                >
                  <TypedLink
                    target="_blank"
                    to={ROUTE_PATHS.BASE.SYSTEM.index}
                    queries={{ active_tab: 'process_connection' }}
                  />
                </Trans>
              }
            />
          }
          name="confirmation_method"
          labelCol={{ span: 16 }}
          wrapperCol={
            language === SupportLanguage.zhCN
              ? { span: 6, push: 2 }
              : { span: 8 }
          }
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.select', {
                name: t(
                  'execWorkflow.detail.operator.scheduleTimeExecuteConfirmMethod'
                )
              })
            }
          ]}
        >
          <ToggleTokens<UpdateWorkflowScheduleReqV2NotifyTypeEnum>
            direction="vertical"
            options={confirmTypeTokens}
            className="full-width-element"
          />
        </ConfirmMethodFormItemLabelStyleWrapper>
      </EmptyBox>
    </Spin>
  );
};

export default ConfirmationSettingForm;
