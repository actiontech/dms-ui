import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import { BasicButton, PageHeader } from '@actiontech/shared';
import BasicInfoWrapper from './BasicInfoWrapper';
import LevelHitSummary from './LevelHitSummary';
import RuleHitDetails from './RuleHitDetails';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import sql_audit_record from '@actiontech/shared/lib/api/sqle/service/sql_audit_record';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { useMemo } from 'react';
import AuditResultList from '../../SqlExecWorkflow/Common/AuditResultList';
import { PlusOutlined, LeftArrowOutlined } from '@actiontech/icons';
import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

/** swagger 未再生前：任务侧最高错误优先级 */
type AuditTaskWithPriority = IAuditTaskResV1 & {
  audit_error_priority?: string;
};

const SqlAuditDetail = () => {
  const { t } = useTranslation();

  const { sql_audit_record_id } = useParams<{ sql_audit_record_id: string }>();
  const { projectID, projectName, projectArchive } = useCurrentProject();

  // api
  const { data: pluginAuditRecord, loading: dataLoading } = useRequest(() =>
    sql_audit_record
      .getSQLAuditRecordV1({
        project_name: projectName,
        sql_audit_record_id: sql_audit_record_id ?? ''
      })
      .then((res) => res.data.data)
  );

  /**
   * 快捷审核详情嵌套 task 偶发返回空 audit_error_priority；
   * 任务详情接口为权威值，用于实例角标（S2 §8.5）。
   */
  const nestedTask = pluginAuditRecord?.task as
    | AuditTaskWithPriority
    | undefined;
  const nestedPriority = (nestedTask?.audit_error_priority ?? '').trim();
  const needTaskPriorityEnrich = !!nestedTask?.task_id && !nestedPriority;
  const taskId = nestedTask?.task_id ? `${nestedTask.task_id}` : '';

  const { data: enrichedTaskPriority, loading: taskPriorityLoading } =
    useRequest(
      () =>
        task
          .getAuditTaskV1({ task_id: `${nestedTask!.task_id}` })
          .then((res) => {
            const data = res.data.data as AuditTaskWithPriority | undefined;
            return (data?.audit_error_priority ?? '').trim();
          }),
      {
        ready: needTaskPriorityEnrich,
        refreshDeps: [nestedTask?.task_id, nestedPriority]
      }
    );

  /**
   * 任务级汇总：只依赖 task_id，与 SQL 明细分页 / 等级筛选无联动（AC-4）。
   */
  const {
    data: auditSummary,
    loading: summaryLoading,
    error: summaryError
  } = useRequest(
    () =>
      task
        .getAuditTaskSummaryV1({ task_id: taskId })
        .then((res) => res.data.data),
    {
      ready: !!taskId,
      refreshDeps: [taskId]
    }
  );

  const basicInfoData = useMemo(() => {
    return {
      id: pluginAuditRecord?.sql_audit_record_id ?? '',
      tags: pluginAuditRecord?.tags ?? [],
      status: pluginAuditRecord?.sql_audit_status,
      task: pluginAuditRecord?.task,
      instance: pluginAuditRecord?.instance
    };
  }, [pluginAuditRecord]);

  const auditResultData = useMemo(() => {
    if (!nestedTask) {
      return [];
    }
    const priority =
      nestedPriority || enrichedTaskPriority || nestedTask.audit_error_priority;
    return [
      {
        ...nestedTask,
        audit_error_priority: priority
      } as AuditTaskWithPriority
    ];
  }, [nestedTask, nestedPriority, enrichedTaskPriority]);

  const ruleExceptionSourceContext = useMemo(() => {
    if (!pluginAuditRecord?.task) {
      return undefined;
    }
    return {
      sqlAuditRecordId: pluginAuditRecord.sql_audit_record_id,
      task: pluginAuditRecord.task
    };
  }, [pluginAuditRecord]);

  return (
    <>
      <Spin
        spinning={
          dataLoading || (needTaskPriorityEnrich && taskPriorityLoading)
        }
      >
        <PageHeader
          fixed
          title={
            <Link to={`/sqle/project/${projectID}/sql-audit`}>
              <BasicButton icon={<LeftArrowOutlined />}>
                {t('sqlAudit.common.goBackList')}
              </BasicButton>
            </Link>
          }
          extra={
            !projectArchive ? (
              <Link to={`/sqle/project/${projectID}/sql-audit/create`}>
                <BasicButton
                  type="primary"
                  icon={
                    <PlusOutlined color="currentColor" width={10} height={10} />
                  }
                >
                  {t('sqlAudit.list.action.create')}
                </BasicButton>
              </Link>
            ) : null
          }
        />
        <div
          className="hasTopHeader clearPaddingBottom"
          style={{ height: '60px' }}
        />
        <BasicInfoWrapper {...basicInfoData} />
        {taskId ? (
          <>
            <LevelHitSummary
              levelSummary={auditSummary?.level_summary}
              loading={summaryLoading}
              error={!!summaryError}
            />
            <RuleHitDetails
              ruleHitDetails={auditSummary?.rule_hit_details}
              loading={summaryLoading}
              error={!!summaryError}
            />
          </>
        ) : null}
        <AuditResultList
          tasks={auditResultData}
          showTaskTab={false}
          ruleExceptionSourceContext={ruleExceptionSourceContext}
        />
      </Spin>
    </>
  );
};

export default SqlAuditDetail;
