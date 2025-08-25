import { useTranslation } from 'react-i18next';
import { AuditExecResultPanelProps } from './index.type';
import { AuditExecResultPanelStyleWrapper } from './style';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicSegmented, EmptyBox } from '@actiontech/shared';
import { WORKFLOW_OVERVIEW_TAB_KEY } from '../../hooks/useAuditExecResultPanelSetup';
import {
  AuditTaskResV1AuditLevelEnum,
  WorkflowResV2ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import useStaticStatus from '../../../../../hooks/useStaticStatus';
import InstanceSegmentedLabel from '../../../Common/InstanceSegmentedLabel';
import { Divider, Space } from 'antd';
import {
  TableFilterButton,
  TableFilterContainer
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ToggleButtonStyleWrapper } from '../../../Common/style';
import DownloadRecord from '../../../Common/DownloadRecord';
import AuditResultFilterContainer from '../../../Common/AuditResultFilterContainer';
import { useMemo } from 'react';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import {
  execStatusDictionary,
  translateDictionaryI18nLabel
} from '../../../../../hooks/useStaticStatus/index.data';
import TaskResultList from './TaskResultList';
import useTaskResultSetup from './hooks/useTaskResultSetup';
import ListLayoutSelector from './ListLayoutSelector';
import WorkflowOverviewList from './OverviewList';

const AuditExecResultPanel: React.FC<AuditExecResultPanelProps> = ({
  activeTabKey,
  taskInfos,
  ...resetProps
}) => {
  const { t } = useTranslation();
  const { getAuditLevelStatusSelectOptionValues } = useStaticStatus();
  const {
    noDuplicate,
    setExecStatusFilterValue,
    setNoDuplicate,
    execStatusFilterValue,
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    updateAllSelectedFilterItem,
    filterContainerMeta,
    filterButtonMeta,
    currentListLayout,
    onTaskListLayoutChange
  } = useTaskResultSetup();

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

  const currentTask = useMemo(
    () => taskInfos.find((v) => v.task_id?.toString() === activeTabKey),
    [activeTabKey, taskInfos]
  );

  const assigneeUserNames = useMemo(() => {
    return (
      resetProps.workflowInfo?.record?.workflow_step_list?.find(
        (v) => v.number === resetProps.workflowInfo?.record?.current_step_number
      )?.assignee_user_name_list ?? []
    );
  }, [
    resetProps.workflowInfo?.record?.current_step_number,
    resetProps.workflowInfo?.record?.workflow_step_list
  ]);

  return (
    <AuditExecResultPanelStyleWrapper>
      <div className="audit-result-title">{t('audit.result')}</div>
      <SegmentedRowStyleWrapper justify="space-between">
        <BasicSegmented
          value={activeTabKey}
          onChange={(value) => {
            if (value === WORKFLOW_OVERVIEW_TAB_KEY) {
              updateAllSelectedFilterItem(false);
            }
            resetProps.activeTabChangeEvent(value as string);
          }}
          options={[
            {
              value: WORKFLOW_OVERVIEW_TAB_KEY,
              label: t('execWorkflow.detail.overview.title')
            },
            ...taskInfos.map((v) => ({
              value: `${v.task_id}`,
              label: generateCurrentTaskLabel(v.instance_name, v.audit_level)
            }))
          ]}
        />

        <div hidden={activeTabKey === WORKFLOW_OVERVIEW_TAB_KEY}>
          <EmptyBox
            if={
              resetProps.workflowInfo?.exec_mode ===
              WorkflowResV2ExecModeEnum.sqls
            }
          >
            <Space size={12} className="audit-result-actions-wrap">
              <TableFilterButton
                updateAllSelectedFilterItem={updateAllSelectedFilterItem}
                filterButtonMeta={filterButtonMeta}
              />
              <Divider
                type="vertical"
                className="audit-result-actions-divider"
              />
              <ToggleButtonStyleWrapper
                active={noDuplicate}
                onClick={() => setNoDuplicate(!noDuplicate)}
              >
                {t('execWorkflow.create.auditResult.clearDuplicate')}
              </ToggleButtonStyleWrapper>
              <DownloadRecord
                taskId={activeTabKey}
                noDuplicate={noDuplicate}
                workflowId={resetProps.workflowInfo?.workflow_id}
              />
            </Space>
          </EmptyBox>

          <ListLayoutSelector
            value={currentListLayout}
            onChange={onTaskListLayoutChange}
          />
        </div>
      </SegmentedRowStyleWrapper>
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        filterCustomProps={
          new Map([
            ['audit_level', { options: getAuditLevelStatusSelectOptionValues }]
          ])
        }
      />

      <EmptyBox if={activeTabKey === WORKFLOW_OVERVIEW_TAB_KEY}>
        <WorkflowOverviewList {...resetProps} />
      </EmptyBox>

      <EmptyBox if={activeTabKey !== WORKFLOW_OVERVIEW_TAB_KEY}>
        {/* todo: 数据需要后端接口支持 http://10.186.18.11/jira/browse/DMS-424*/}
        <EmptyBox
          if={
            resetProps.workflowInfo?.exec_mode ===
            WorkflowResV2ExecModeEnum.sqls
          }
        >
          <AuditResultFilterContainer
            className="audit-result-filter-container-borderless"
            passRate={currentTask?.pass_rate}
            score={currentTask?.score}
            instanceSchemaName={currentTask?.instance_schema}
            auditLevel={currentTask?.audit_level}
            value={execStatusFilterValue}
            onChange={setExecStatusFilterValue}
            options={Object.keys(getAuditTaskSQLsV2FilterExecStatusEnum)}
            withAll={{
              label: t('audit.execStatus.allStatus'),
              value: null
            }}
            labelDictionary={translateDictionaryI18nLabel(execStatusDictionary)}
          />
        </EmptyBox>

        <TaskResultList
          taskId={activeTabKey}
          currentListLayout={currentListLayout}
          execStatusFilterValue={execStatusFilterValue}
          noDuplicate={noDuplicate}
          auditResultActiveKey={activeTabKey}
          tableFilterInfo={tableFilterInfo}
          workflowStatus={resetProps.workflowInfo?.record?.status}
          assigneeUserNames={assigneeUserNames}
          pagination={pagination}
          tableChange={tableChange}
          executeMode={
            (currentTask?.exec_mode as WorkflowResV2ExecModeEnum) ??
            WorkflowResV2ExecModeEnum.sqls
          }
          backupConflict={currentTask?.backup_conflict_with_instance}
          dbType={currentTask?.instance_db_type}
          enableBackup={currentTask?.enable_backup}
          taskStatus={currentTask?.status}
          instanceName={currentTask?.instance_name}
          schema={currentTask?.instance_schema}
        />
      </EmptyBox>
    </AuditExecResultPanelStyleWrapper>
  );
};

export default AuditExecResultPanel;
