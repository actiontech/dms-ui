import { BasicSegmented, EmptyBox, BasicButton } from '@actiontech/shared';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { Divider, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { AuditResultForCreateWorkflowStyleWrapper } from './style';
import { useEffect, useMemo, useState } from 'react';
import { getAuditTaskSQLsV2FilterAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { AuditResultListProps } from './index.type';
import InstanceSegmentedLabel from '../InstanceSegmentedLabel';
import { ToggleButtonStyleWrapper } from '../style';
import DownloadRecord from '../DownloadRecord';
import AuditResultTable from './Table';
import AuditResultFilterContainer from '../AuditResultFilterContainer';
import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import useAuditResultFilterParams from '../AuditResultFilterContainer/useAuditResultFilterParams';
import {
  auditLevelDictionary,
  translateDictionaryI18nLabel
} from '../../../../hooks/useStaticStatus/index.data';

const AuditResultList: React.FC<AuditResultListProps> = ({
  tasks,
  updateTaskRecordCount,
  showTaskTab = true,
  allowSwitchBackupPolicy = false,
  onBatchSwitchBackupPolicy,
  tasksSupportedBackupPolicies,
  updateTaskAuditRuleExceptionStatus
}) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const {
    noDuplicate,
    setNoDuplicate,
    auditLevelFilterValue,
    setAuditLevelFilterValue
  } = useAuditResultFilterParams();

  const [currentTaskID, setCurrentTaskID] = useState<string>();

  const currentTask = useMemo(
    () => tasks.find((v) => `${v.task_id}` === currentTaskID),
    [currentTaskID, tasks]
  );

  const currentTaskSupportedBackupPolicies = useMemo(() => {
    return tasksSupportedBackupPolicies?.[currentTask?.task_id ?? 0];
  }, [tasksSupportedBackupPolicies, currentTask?.task_id]);

  const handleChangeCurrentTask = (taskID?: string) => {
    setCurrentTaskID(taskID);
  };

  const generateCurrentTaskLabel = (
    instanceName?: string,
    auditLevel?: AuditTaskResV1AuditLevelEnum
  ) => {
    if (!instanceName) {
      return '-';
    }

    return (
      <InstanceSegmentedLabel
        instanceName={instanceName}
        auditLevel={auditLevel}
      />
    );
  };

  useEffect(() => {
    if (typeof tasks?.[0]?.task_id !== 'undefined') {
      setCurrentTaskID(`${tasks[0].task_id}`);
    }
  }, [tasks]);

  return (
    <AuditResultForCreateWorkflowStyleWrapper>
      <SegmentedRowStyleWrapper justify={'space-between'}>
        {showTaskTab ? (
          <BasicSegmented
            value={currentTaskID}
            onChange={(v) => {
              handleChangeCurrentTask(v as string);
            }}
            options={tasks.map((v) => ({
              label: generateCurrentTaskLabel(v.instance_name, v.audit_level),
              value: !!v?.task_id ? `${v.task_id}` : '',
              key: v.task_id
            }))}
          />
        ) : (
          <div />
        )}

        <Space size={4}>
          {/* #if [ee] */}
          <EmptyBox if={allowSwitchBackupPolicy && currentTask?.enable_backup}>
            <BasicButton
              onClick={() => {
                onBatchSwitchBackupPolicy?.(
                  currentTaskID,
                  currentTaskSupportedBackupPolicies
                );
              }}
            >
              {t('execWorkflow.create.auditResult.switchDatabaseBackupPolicy')}
            </BasicButton>
            <Divider type="vertical" style={{ height: 28 }} />
          </EmptyBox>
          {/* #endif */}
          <ToggleButtonStyleWrapper
            active={noDuplicate}
            onClick={() => {
              setNoDuplicate(!noDuplicate);
            }}
          >
            {t('execWorkflow.create.auditResult.clearDuplicate')}
          </ToggleButtonStyleWrapper>

          <Divider type="vertical" style={{ height: 28 }} />
          <EmptyBox if={!!currentTaskID}>
            <DownloadRecord noDuplicate={noDuplicate} taskId={currentTaskID!} />
          </EmptyBox>
        </Space>
      </SegmentedRowStyleWrapper>
      {/* todo: options 中部分数据需要后端接口支持 http://10.186.18.11/jira/browse/DMS-424*/}
      <AuditResultFilterContainer
        passRate={currentTask?.pass_rate}
        score={currentTask?.score}
        instanceSchemaName={currentTask?.instance_schema}
        auditLevel={currentTask?.audit_level}
        value={auditLevelFilterValue}
        onChange={setAuditLevelFilterValue}
        options={Object.keys(getAuditTaskSQLsV2FilterAuditLevelEnum)}
        withAll={{
          label: t('execWorkflow.create.auditResult.allLevel'),
          value: null
        }}
        labelDictionary={translateDictionaryI18nLabel(auditLevelDictionary)}
      />
      <AuditResultTable
        taskID={currentTaskID}
        noDuplicate={noDuplicate}
        auditLevelFilterValue={auditLevelFilterValue}
        projectID={projectID}
        updateTaskRecordCount={updateTaskRecordCount}
        dbType={currentTask?.instance_db_type}
        allowSwitchBackupPolicy={allowSwitchBackupPolicy}
        supportedBackupPolicies={currentTaskSupportedBackupPolicies}
        updateTaskAuditRuleExceptionStatus={updateTaskAuditRuleExceptionStatus}
      />
    </AuditResultForCreateWorkflowStyleWrapper>
  );
};

export default AuditResultList;
