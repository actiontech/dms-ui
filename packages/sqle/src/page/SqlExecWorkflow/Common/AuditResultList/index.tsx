import { BasicSegmented, EmptyBox } from '@actiontech/shared';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { Divider, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { AuditResultForCreateWorkflowStyleWrapper } from './style';
import { useEffect, useMemo, useState } from 'react';
import { AuditResultListProps } from './index.type';
import InstanceSegmentedLabel from '../InstanceSegmentedLabel';
import { ToggleButtonStyleWrapper } from '../style';
import DownloadRecord from '../DownloadRecord';
import AuditResultTable from './Table';
import AuditResultFilterContainer from '../AuditResultFilterContainer';
import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import useAuditResultFilterParams from '../AuditResultFilterContainer/useAuditResultFilterParams';
import {
  auditLevelFilterLabelDictionary,
  translateDictionaryI18nLabel
} from '../../../../hooks/useStaticStatus/index.data';
import { StaticEnumDictionary } from '../../../../hooks/useStaticStatus/index.type';
import {
  AUDIT_LEVEL_FILTER_SEGMENT_OPTIONS,
  AuditLevelFilterUIValue
} from '../auditLevelFilter';

const AuditResultList: React.FC<AuditResultListProps> = ({
  tasks,
  updateTaskRecordCount,
  showTaskTab = true,
  ruleExceptionSourceContext
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

  const resolvedRuleExceptionSourceContext = useMemo(() => {
    if (ruleExceptionSourceContext) {
      return ruleExceptionSourceContext;
    }
    if (!currentTask?.task_id) {
      return undefined;
    }
    return {
      task: {
        task_id: currentTask.task_id,
        instance_name: currentTask.instance_name,
        instance_db_type: currentTask.instance_db_type
      }
    };
  }, [currentTask, ruleExceptionSourceContext]);

  const handleChangeCurrentTask = (taskID?: string) => {
    setCurrentTaskID(taskID);
  };

  const generateCurrentTaskLabel = (
    instanceName?: string,
    auditLevel?: AuditTaskResV1AuditLevelEnum,
    auditErrorPriority?: string | null
  ) => {
    if (!instanceName) {
      return '-';
    }

    return (
      <InstanceSegmentedLabel
        instanceName={instanceName}
        auditLevel={auditLevel}
        auditErrorPriority={auditErrorPriority}
      />
    );
  };

  const currentTaskAuditErrorPriority = (
    currentTask as { audit_error_priority?: string } | undefined
  )?.audit_error_priority;

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
              label: generateCurrentTaskLabel(
                v.instance_name,
                v.audit_level,
                (v as { audit_error_priority?: string }).audit_error_priority
              ),
              value: !!v?.task_id ? `${v.task_id}` : '',
              key: v.task_id
            }))}
          />
        ) : (
          <EmptyBox if={!!currentTask?.instance_name}>
            {generateCurrentTaskLabel(
              currentTask?.instance_name,
              currentTask?.audit_level,
              currentTaskAuditErrorPriority
            )}
          </EmptyBox>
        )}

        <Space size={4}>
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
            <DownloadRecord
              noDuplicate={noDuplicate}
              taskId={currentTaskID!}
              auditLevelFilterValue={auditLevelFilterValue}
            />
          </EmptyBox>
        </Space>
      </SegmentedRowStyleWrapper>
      {/* todo: options 中部分数据需要后端接口支持 http://10.186.18.11/jira/browse/DMS-424*/}
      <AuditResultFilterContainer<AuditLevelFilterUIValue>
        passRate={currentTask?.pass_rate}
        score={currentTask?.score}
        instanceSchemaName={currentTask?.instance_schema}
        auditLevel={currentTask?.audit_level}
        value={auditLevelFilterValue}
        onChange={setAuditLevelFilterValue}
        options={AUDIT_LEVEL_FILTER_SEGMENT_OPTIONS}
        withAll={{
          label: t('execWorkflow.create.auditResult.allLevel'),
          value: undefined
        }}
        labelDictionary={translateDictionaryI18nLabel(
          // i18n key 已写入 locale；类型表未再生前放宽
          auditLevelFilterLabelDictionary as unknown as StaticEnumDictionary<
            Exclude<AuditLevelFilterUIValue, undefined> | 'error'
          >
        )}
      />
      <AuditResultTable
        taskID={currentTaskID}
        noDuplicate={noDuplicate}
        auditLevelFilterValue={auditLevelFilterValue}
        projectID={projectID}
        updateTaskRecordCount={updateTaskRecordCount}
        dbType={currentTask?.instance_db_type}
        ruleExceptionSourceContext={resolvedRuleExceptionSourceContext}
      />
    </AuditResultForCreateWorkflowStyleWrapper>
  );
};

export default AuditResultList;
