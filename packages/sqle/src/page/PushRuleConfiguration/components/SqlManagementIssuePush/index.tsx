import { Space, message } from 'antd';
import type {
  SqlManagementIssuePushFields,
  SqlManagementIssuePushProps
} from './index.type';
import { useRequest } from 'ahooks';
import ReportPushConfig from '@actiontech/shared/lib/api/sqle/service/ReportPushConfig';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTranslation } from 'react-i18next';
import {
  CustomAvatar,
  BasicToolTip,
  ConfigModifyBtn,
  ConfigSubmitButtonField,
  ConfigSwitch,
  EmptyBox,
  ReadOnlyConfigColumnsType,
  useConfigRender,
  useConfigSwitchControls
} from '@actiontech/shared';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { useEffect, useMemo } from 'react';
import { IReportPushConfigList } from '@actiontech/shared/lib/api/sqle/service/common';
import ConfigFields from './ConfigFields';
import {
  UpdateReportPushConfigReqV1PushUserTypeEnum,
  UpdateReportPushConfigReqV1TriggerTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import useUsername from '../../../../hooks/useUsername';
import { getNextExecutionTimesByCronExpression } from '@actiontech/shared/lib/components/CronInput/useCron/cron.tool';
import { InfoCircleOutlined } from '@actiontech/icons';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import useCurrentTime from './useCurrentTime';
import {
  PermissionControl,
  PERMISSIONS
} from '@actiontech/shared/lib/features';

const switchFieldName: keyof SqlManagementIssuePushFields = 'enabled';

const SqlManagementIssuePush: React.FC<SqlManagementIssuePushProps> = ({
  config,
  refetch
}) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { sharedTheme } = useThemeStyleData();
  const currentTime = useCurrentTime(60 * 1000);

  const {
    usernameList,
    generateUsernameSelectOption,
    updateUsernameList,
    loading: fetchUserTipsPending
  } = useUsername();

  const {
    form,
    renderConfigForm,
    modifyFlag,
    startModify,
    modifyFinish,
    extraButtonsVisible,
    enabled
  } = useConfigRender<SqlManagementIssuePushFields>({
    switchFieldName,
    switchFieldLabel: (
      <BasicToolTip
        title={t('pushRule.pushRule.sqlManagementIssuePush.labelTips')}
        suffixIcon={
          <InfoCircleOutlined color={sharedTheme.uiToken.colorTextTertiary} />
        }
      >
        <span>{t('pushRule.pushRule.sqlManagementIssuePush.label')}</span>
      </BasicToolTip>
    )
  });

  const {
    configSwitchPopoverOpenState,
    generateConfigSwitchPopoverTitle,
    onConfigSwitchPopoverOpen,
    handleConfigSwitchChange,
    hiddenConfigSwitchPopover
  } = useConfigSwitchControls(form, switchFieldName);

  const readonlyColumnsConfig = useMemo<
    ReadOnlyConfigColumnsType<IReportPushConfigList>
  >(() => {
    return config?.enabled
      ? [
          {
            label: (
              <BasicToolTip
                title={t(
                  'pushRule.pushRule.workflowUpdateNotifier.pushFrequencyTips'
                )}
                suffixIcon={
                  <InfoCircleOutlined
                    width={14}
                    height={14}
                    color={sharedTheme.uiToken.colorTextTertiary}
                  />
                }
              >
                {t('pushRule.pushRule.workflowUpdateNotifier.pushFrequency')}
              </BasicToolTip>
            ),
            dataIndex: 'trigger_type',
            render(_, record) {
              if (!record.push_frequency_cron) {
                return t(
                  'pushRule.pushRule.workflowUpdateNotifier.pushFrequencyEmptyTips'
                );
              }
              try {
                const nextExecutionTimes =
                  getNextExecutionTimesByCronExpression(
                    record.push_frequency_cron,
                    currentTime
                  );
                return t(
                  'pushRule.pushRule.workflowUpdateNotifier.pushFrequencyValueFormatter',
                  {
                    time: formatTime(nextExecutionTimes[0], '--')
                  }
                );
              } catch (error) {
                return t(
                  'pushRule.pushRule.workflowUpdateNotifier.pushFrequencyErrorTips'
                );
              }
            }
          },
          {
            label: t('pushRule.pushRule.workflowUpdateNotifier.pusher'),
            span: 3,
            dataIndex: 'push_user_list',
            render(userIds) {
              return (
                <Space size={8}>
                  {userIds?.map((id) => {
                    const name = usernameList.find(
                      (v) => v.user_id === id
                    )?.user_name;
                    return <CustomAvatar size="small" key={id} name={name} />;
                  })}
                </Space>
              );
            }
          },
          {
            label: t('pushRule.pushRule.workflowUpdateNotifier.lastPushTime'),
            span: 3,
            dataIndex: 'last_push_time',
            render(time) {
              return formatTime(time, '--');
            }
          }
        ]
      : [];
  }, [
    config?.enabled,
    currentTime,
    sharedTheme.uiToken.colorTextTertiary,
    t,
    usernameList
  ]);

  const { run: onSubmit, loading: submitPending } = useRequest(
    (configSwitchEnabled: boolean, values?: SqlManagementIssuePushFields) => {
      return ReportPushConfig.UpdateReportPushConfig({
        project_name: projectName,
        report_push_config_id: config?.report_push_config_id ?? '',
        enabled: configSwitchEnabled,
        push_user_Type:
          config?.push_user_Type as unknown as UpdateReportPushConfigReqV1PushUserTypeEnum,
        trigger_type:
          config?.trigger_type as unknown as UpdateReportPushConfigReqV1TriggerTypeEnum,
        push_frequency_cron:
          values?.minutesInterval ?? config?.push_frequency_cron,
        push_user_list: values?.pushUserList ?? config?.push_user_list
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refetch();
          handleClickCancel();
          messageApi.success(
            t('pushRule.pushRule.workflowUpdateNotifier.successTips')
          );
        }
      });
    },
    { manual: true }
  );

  const setFormDefaultValues = () => {
    form.setFieldsValue({
      minutesInterval: config?.push_frequency_cron,
      pushUserList: config?.push_user_list ?? []
    });
  };

  const handleClickModify = () => {
    startModify();
    setFormDefaultValues();
  };

  const handleClickCancel = () => {
    form.setFieldValue(switchFieldName, !!config?.enabled);
    setFormDefaultValues();
    modifyFinish();
  };

  const onConfigSwitchPopoverConfirm = () => {
    if (!config?.enabled && modifyFlag) {
      handleClickCancel();
      hiddenConfigSwitchPopover();
    } else {
      onSubmit(false);
    }
  };

  useEffect(() => {
    updateUsernameList({ filter_project: projectName });
  }, [projectName, updateUsernameList]);

  useEffect(() => {
    form.setFieldValue(switchFieldName, !!config?.enabled);
  }, [config?.enabled, form]);

  return (
    <>
      {messageContextHolder}
      {renderConfigForm({
        onSubmit: (values) => {
          onSubmit(enabled, values);
        },
        data: config ?? {},
        columns: readonlyColumnsConfig,
        configExtraButtons: (
          <EmptyBox if={extraButtonsVisible && !!config?.enabled}>
            <PermissionControl
              permission={
                PERMISSIONS.ACTIONS.SQLE.PUSH_RULE_CONFIGURATION
                  .SQL_MANAGEMENT_ISSUE_PUSH_SWITCH
              }
            >
              <ConfigModifyBtn onClick={handleClickModify} />
            </PermissionControl>
          </EmptyBox>
        ),
        configSwitchNode: (
          <PermissionControl
            permission={
              PERMISSIONS.ACTIONS.SQLE.PUSH_RULE_CONFIGURATION
                .SQL_MANAGEMENT_ISSUE_PUSH_SWITCH
            }
          >
            <ConfigSwitch
              title={generateConfigSwitchPopoverTitle(modifyFlag)}
              switchFieldName={switchFieldName}
              submitLoading={submitPending}
              popoverVisible={configSwitchPopoverOpenState}
              onConfirm={onConfigSwitchPopoverConfirm}
              onSwitchChange={(open) => {
                handleConfigSwitchChange(open, handleClickModify);
              }}
              onSwitchPopoverOpen={onConfigSwitchPopoverOpen}
            />
          </PermissionControl>
        ),
        configField: (
          <ConfigFields
            submitPending={submitPending}
            fetchUserTipsPending={fetchUserTipsPending}
            generateUsernameSelectOption={generateUsernameSelectOption}
          />
        ),
        submitButtonField: (
          <ConfigSubmitButtonField
            submitLoading={submitPending}
            handleClickCancel={handleClickCancel}
          />
        )
      })}
    </>
  );
};

export default SqlManagementIssuePush;
