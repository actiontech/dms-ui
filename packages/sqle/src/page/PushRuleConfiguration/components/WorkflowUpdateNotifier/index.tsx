import { Popconfirm, message } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  WorkflowUpdateNotifierFields,
  WorkflowUpdateNotifierProps
} from './index.type';
import {
  WorkflowPushFrequencyDictionary,
  WorkflowPushUserTypeDictionary
} from './index.data';
import { formatTime } from '@actiontech/dms-kit';
import { BasicSwitch, BasicToolTip } from '@actiontech/dms-kit';
import {
  ReadOnlyConfigColumnsType,
  useConfigRender
} from '@actiontech/dms-kit';
import ReportPushConfig from '@actiontech/shared/lib/api/sqle/service/ReportPushConfig';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/dms-kit';
import { useBoolean, useRequest } from 'ahooks';
import {
  UpdateReportPushConfigReqV1PushUserTypeEnum,
  UpdateReportPushConfigReqV1TriggerTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IReportPushConfigList } from '@actiontech/shared/lib/api/sqle/service/common';
import { useMemo } from 'react';
import { InfoCircleOutlined } from '@actiontech/icons';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import {
  PermissionControl,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
const switchFieldName: keyof WorkflowUpdateNotifierFields = 'enabled';
const WorkflowUpdateNotifier: React.FC<WorkflowUpdateNotifierProps> = ({
  config,
  refetch
}) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { sharedTheme } = useThemeStyleData();
  const { run: onSubmit, loading: submitPending } = useRequest(
    () =>
      ReportPushConfig.UpdateReportPushConfig({
        project_name: projectName,
        report_push_config_id: config?.report_push_config_id ?? '',
        enabled: !config?.enabled,
        push_user_list: config?.push_user_list,
        push_user_Type:
          config?.push_user_Type as unknown as UpdateReportPushConfigReqV1PushUserTypeEnum,
        trigger_type:
          config?.trigger_type as unknown as UpdateReportPushConfigReqV1TriggerTypeEnum
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refetch();
          messageApi.success(
            t('pushRule.pushRule.workflowUpdateNotifier.successTips')
          );
        }
      }),
    {
      manual: true
    }
  );
  const { renderConfigForm } = useConfigRender<WorkflowUpdateNotifierFields>({
    switchFieldName,
    switchFieldLabel: (
      <BasicToolTip
        title={t('pushRule.pushRule.workflowUpdateNotifier.labelTips')}
        suffixIcon={
          <InfoCircleOutlined color={sharedTheme.uiToken.colorTextTertiary} />
        }
      >
        <span>{t('pushRule.pushRule.workflowUpdateNotifier.label')}</span>
      </BasicToolTip>
    )
  });
  const [
    configSwitchPopoverVisible,
    { setTrue: showConfigSwitchPopover, setFalse: closeConfigSwitchPopover }
  ] = useBoolean(false);
  const onConfigSwitchPopoverConfirm = () => {
    closeConfigSwitchPopover();
    onSubmit();
  };
  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IReportPushConfigList> =
    useMemo(() => {
      return config?.enabled
        ? [
            {
              label: t(
                'pushRule.pushRule.workflowUpdateNotifier.pushFrequency'
              ),
              dataIndex: 'trigger_type',
              render: (type) => {
                return type
                  ? WorkflowPushFrequencyDictionary[type] ?? 'unknown'
                  : '--';
              }
            },
            {
              label: t('pushRule.pushRule.workflowUpdateNotifier.pusher'),
              dataIndex: 'push_user_Type',
              render: (type) => {
                return type
                  ? WorkflowPushUserTypeDictionary[type] ?? 'unknown'
                  : '--';
              }
            },
            {
              label: t('pushRule.pushRule.workflowUpdateNotifier.lastPushTime'),
              dataIndex: 'last_push_time',
              render: (time) => {
                return formatTime(time, '--');
              }
            }
          ]
        : [];
    }, [config?.enabled, t]);
  return (
    <>
      {messageContextHolder}
      {renderConfigForm({
        data: config ?? {},
        columns: readonlyColumnsConfig,
        configExtraButtons: null,
        configField: null,
        configSwitchNode: (
          <PermissionControl
            permission={
              PERMISSIONS.ACTIONS.SQLE.PUSH_RULE_CONFIGURATION
                .WORKFLOW_MODIFICATION_NOTIFIER_SWITCHER_SWITCH
            }
          >
            <Popconfirm
              title={
                config?.enabled
                  ? t(
                      'pushRule.pushRule.workflowUpdateNotifier.closedConfirmTitle'
                    )
                  : t(
                      'pushRule.pushRule.workflowUpdateNotifier.enabledConfirmTitle'
                    )
              }
              open={configSwitchPopoverVisible}
              onConfirm={onConfigSwitchPopoverConfirm}
              onCancel={closeConfigSwitchPopover}
              okText={t('common.ok')}
            >
              <BasicSwitch
                data-testid="config-switch"
                disabled={submitPending}
                onClick={showConfigSwitchPopover}
                checked={!!config?.enabled}
              />
            </Popconfirm>
          </PermissionControl>
        )
      })}
    </>
  );
};
export default WorkflowUpdateNotifier;
