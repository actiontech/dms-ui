import { Popconfirm, Spin, message } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  WorkflowUpdateNotifierFields,
  WorkflowUpdateNotifierProps
} from './index.type';
import {
  WorkflowPushFrequencyDictionary,
  WorkflowPushUserTypeDictionary
} from './index.data';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import {
  BasicSwitch,
  BasicToolTips,
  EmptyBox,
  ReadOnlyConfigColumnsType,
  useConfigRender
} from '@actiontech/shared';
import ReportPushConfig from '@actiontech/shared/lib/api/sqle/service/ReportPushConfig';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean, useRequest } from 'ahooks';
import {
  UpdateReportPushConfigReqV1PushUserTypeEnum,
  UpdateReportPushConfigReqV1TriggerTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IReportPushConfigList } from '@actiontech/shared/lib/api/sqle/service/common';
import { useMemo } from 'react';
import { InfoCircleOutlined } from '@actiontech/icons';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';

const switchFieldName: keyof WorkflowUpdateNotifierFields = 'enabled';

const WorkflowUpdateNotifier: React.FC<WorkflowUpdateNotifierProps> = ({
  config,
  permission,
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
    { manual: true }
  );

  const { renderConfigForm } = useConfigRender<WorkflowUpdateNotifierFields>({
    switchFieldName,
    switchFieldLabel: (
      <BasicToolTips
        title={t('pushRule.pushRule.workflowUpdateNotifier.labelTips')}
        suffixIcon={
          <InfoCircleOutlined color={sharedTheme.uiToken.colorTextTertiary} />
        }
      >
        <span>{t('pushRule.pushRule.workflowUpdateNotifier.label')}</span>
      </BasicToolTips>
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
    <Spin spinning={submitPending} delay={300}>
      {messageContextHolder}
      {renderConfigForm({
        data: config ?? {},
        columns: readonlyColumnsConfig,
        configExtraButtons: null,
        configField: null,
        configSwitchNode: (
          <EmptyBox if={permission}>
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
            >
              <BasicSwitch
                onClick={showConfigSwitchPopover}
                checked={!!config?.enabled}
              />
            </Popconfirm>
          </EmptyBox>
        )
      })}
    </Spin>
  );
};

export default WorkflowUpdateNotifier;