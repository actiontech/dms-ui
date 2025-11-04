import {
  BasicButton,
  BasicTag,
  BasicToolTip,
  EmptyBox,
  SegmentedTabs
} from '@actiontech/dms-kit';
import { SQLRenderer } from '@actiontech/shared';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { Copy, ResponseCode } from '@actiontech/dms-kit';
import { useBoolean } from 'ahooks';
import { Divider, Space, Spin, message } from 'antd';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { SqlExecuteResultCardProps } from './index.type';
import ExecStatusTag from './components/ExecStatusTag';
import AuditResultTag from './components/AuditResultTag';
import AuditResultTree from './components/AuditResultTree';
import ResultDescribe from './components/ResultDescribe';
import { TasksResultCardStyleWrapper } from './style';
import { ProfileSquareFilled, EnvironmentFilled } from '@actiontech/icons';
import useThemeStyleData from '../../../../../../../../hooks/useThemeStyleData';
import { parse2ReactRouterPath } from '@actiontech/shared/lib/components/TypedRouter/utils';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { TaskResultContentTypeEnum } from './index.data';
import { BackupStrategyDictionary } from '../../../../../../Common/AuditResultList/Table/index.data';
import {
  UpdateSqlBackupStrategyReqStrategyEnum,
  AuditTaskResV1StatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { WarningFilled } from '@actiontech/icons';
import RollbackWorkflowEntry from './components/RollbackWorkflowEntry';
import { formatterSQL } from '@actiontech/dms-kit';
import AuditExceptionTree from './components/AuditExceptionTree';
import { IAuditResultItem } from '../../../../../../../../components/ReportDrawer/index.type';
import { useDispatch } from 'react-redux';
import {
  updateRetryExecuteData,
  updateSqlExecWorkflowModalStatus
} from '../../../../../../../../store/sqlExecWorkflow/index';
import { ModalName } from '../../../../../../../../data/ModalName';
import {
  PermissionControl,
  PERMISSIONS
} from '@actiontech/shared/lib/features';

const SqlMode: React.FC<SqlExecuteResultCardProps> = ({
  projectID,
  taskId,
  onUpdateDescription,
  pagination,
  enableRetryExecute,
  ...props
}) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { sqleTheme } = useThemeStyleData();
  const dispatch = useDispatch();
  const [loading, { setTrue: updateDescPending, setFalse: updateDescDone }] =
    useBoolean();
  const [currentContentKey, setCurrentContentKey] =
    useState<TaskResultContentTypeEnum>(TaskResultContentTypeEnum.exec_sql);
  const { auditResultWithNormalLevel, auditResultWithAuditException } =
    useMemo(() => {
      const normalLevel: IAuditResultItem[] = [];
      const exceptionResult: IAuditResultItem[] = [];
      (props.audit_result ?? []).forEach((item) => {
        if (item.execution_failed) {
          exceptionResult.push(item);
        } else {
          normalLevel.push(item);
        }
      });
      return {
        auditResultWithAuditException: exceptionResult,
        auditResultWithNormalLevel: normalLevel
      };
    }, [props?.audit_result]);
  const onCopyExecSql = () => {
    Copy.copyTextByTextarea(props.exec_sql ?? '');
    messageApi.success(t('common.copied'));
  };
  const onClickAnalyze = () => {
    window.open(
      parse2ReactRouterPath(ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.analyze, {
        params: {
          projectID,
          taskId: taskId ?? '',
          sqlNum: props.number?.toString() ?? ''
        },
        queries: {
          instance_name: props.instanceName ?? '',
          schema: props.schema ?? ''
        }
      })
    );
  };

  const onRetryExecute = () => {
    dispatch(
      updateSqlExecWorkflowModalStatus({
        modalName: ModalName.Sql_Exec_Workflow_Retry_Execute_Modal,
        status: true
      })
    );
    dispatch(
      updateRetryExecuteData({
        taskId: taskId ?? '',
        execSqlId: props.exec_sql_id ?? 0,
        pageIndex: pagination?.page_index,
        pageSize: pagination?.page_size
      })
    );
  };

  const updateSqlDescribe = (sqlDescribe: string) => {
    updateDescPending();
    task
      .updateAuditTaskSQLsV1({
        number: `${props.number}`,
        description: sqlDescribe,
        task_id: `${taskId}`
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onUpdateDescription?.();
        }
      })
      .finally(() => {
        updateDescDone();
      });
  };
  const formattedRollbackSql = useMemo(() => {
    try {
      return props.rollback_sqls
        ?.map((v) => formatterSQL(v, props.dbType))
        ?.join('\n');
    } catch {
      // 当切换task时 当新的task sql请求未完成时 这时rollback_sqls还是老的数据 这时如果dbType不同 可能会导致解析sql失败报错
      return props.rollback_sqls?.join('\n');
    }
  }, [props.rollback_sqls, props.dbType]);
  const sqlBackupResult = useMemo(() => {
    if (props.backup_result) {
      return props.backup_result;
    }
    // todo 目前接口定义的AuditTaskResV1StatusEnum.exec_success枚举值和接口实际返回的不一致，接口返回的是exec_succeeded 属于后端历史遗留问题 后端需要考虑影响面再去决定是否统一
    const taskNotExecuted = props?.taskStatus
      ? ![
          'exec_succeeded',
          AuditTaskResV1StatusEnum.exec_failed,
          AuditTaskResV1StatusEnum.manually_executed
        ].includes(props.taskStatus)
      : true;
    return taskNotExecuted
      ? t('execWorkflow.audit.table.backupExecuteBeforeTips')
      : '';
  }, [props.taskStatus, props.backup_result, t]);
  return (
    <TasksResultCardStyleWrapper>
      {contextHolder}
      <div className="result-card-header">
        <Space>
          <span className="number">#{props.number}</span>
          <div className="result-card-status-wrap">
            <ExecStatusTag
              status={
                props.exec_status as getAuditTaskSQLsV2FilterExecStatusEnum
              }
            />
            <Divider type="vertical" className="result-card-status-divider" />
            <AuditResultTag
              auditResult={auditResultWithNormalLevel}
              auditExceptionResultCount={auditResultWithAuditException.length}
            />
          </div>
        </Space>
        <Space>
          {/* #if [ee] */}
          <EmptyBox if={!!props.associated_rollback_workflows?.length}>
            <RollbackWorkflowEntry
              workflows={props.associated_rollback_workflows}
            />
          </EmptyBox>
          {/* #endif */}
          <EmptyBox
            if={
              [
                getAuditTaskSQLsV2FilterExecStatusEnum.failed,
                getAuditTaskSQLsV2FilterExecStatusEnum.initialized
              ].includes(
                props.exec_status as getAuditTaskSQLsV2FilterExecStatusEnum
              ) && !!enableRetryExecute
            }
          >
            <PermissionControl
              permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.EXEC_TASK}
            >
              <BasicButton size="small" onClick={onRetryExecute}>
                {t('execWorkflow.detail.overview.table.retryExecute')}
              </BasicButton>
            </PermissionControl>
          </EmptyBox>
          <BasicButton size="small" onClick={onCopyExecSql}>
            {t('execWorkflow.audit.copyExecSql')}
          </BasicButton>
          <BasicButton size="small" onClick={onClickAnalyze}>
            {t('execWorkflow.audit.table.analyze')}
          </BasicButton>
        </Space>
      </div>
      <div className="result-card-content">
        <div className="result-card-content-options">
          <SegmentedTabs
            activeKey={currentContentKey}
            onChange={(v) => {
              setCurrentContentKey(v as TaskResultContentTypeEnum);
            }}
            items={[
              {
                value: TaskResultContentTypeEnum.exec_sql,
                label: t('execWorkflow.audit.table.execSql'),
                children: (
                  <SQLRenderer sql={props.exec_sql} showLineNumbers wordWrap />
                )
              },
              {
                value: TaskResultContentTypeEnum.rollback_sql,
                label: t('execWorkflow.audit.table.rollback'),
                children: (
                  <Space
                    direction="vertical"
                    className="rollback-sql-container"
                  >
                    {/* #if [ee] */}
                    <EmptyBox if={!!props.backup_strategy_tip}>
                      <Space className="backup-conflict-tips">
                        <WarningFilled width={16} height={16} />
                        {props.backup_strategy_tip}
                      </Space>
                    </EmptyBox>
                    <Space>
                      <EmptyBox
                        if={props.backupConflict}
                        defaultNode={
                          <EmptyBox if={!!props.backup_strategy}>
                            <BasicTag>
                              {
                                BackupStrategyDictionary[
                                  props.backup_strategy as unknown as UpdateSqlBackupStrategyReqStrategyEnum
                                ]
                              }
                            </BasicTag>
                          </EmptyBox>
                        }
                      >
                        <Space className="backup-conflict-tips">
                          <WarningFilled width={16} height={16} />
                          {t('execWorkflow.audit.table.backupConflictTips')}
                        </Space>
                      </EmptyBox>
                      <EmptyBox if={props.enableBackup}>
                        <Divider
                          type="vertical"
                          className="result-card-status-divider"
                        />
                        {sqlBackupResult}
                      </EmptyBox>
                    </Space>
                    {/* #endif */}
                    <SQLRenderer
                      sql={formattedRollbackSql}
                      showLineNumbers
                      wordWrap
                    />
                  </Space>
                )
              },
              {
                value: TaskResultContentTypeEnum.exec_result,
                label: t('execWorkflow.audit.table.execResult'),
                children: props.exec_result || '-'
              }
            ]}
            segmentedRowExtraContent={
              <Space size={0}>
                <EmptyBox
                  if={!!props?.sql_source_file}
                  defaultNode={
                    <BasicToolTip
                      title={t('execWorkflow.audit.sqlFileSource.tips')}
                    >
                      <Space>
                        <BasicTag
                          icon={
                            <ProfileSquareFilled
                              width={18}
                              height={18}
                              color={sqleTheme.icon.execWorkFlow.fileList}
                            />
                          }
                        >
                          <span className="sql-source-title">
                            {t('execWorkflow.audit.sqlFileSource.source')}
                          </span>
                          -
                        </BasicTag>
                      </Space>
                    </BasicToolTip>
                  }
                >
                  <BasicTag
                    icon={
                      <ProfileSquareFilled
                        width={18}
                        height={18}
                        color={sqleTheme.icon.execWorkFlow.fileList}
                      />
                    }
                  >
                    <span className="sql-source-title">
                      {t('execWorkflow.audit.sqlFileSource.source')}
                    </span>
                    {props?.sql_source_file}
                  </BasicTag>
                </EmptyBox>
                <BasicTag icon={<EnvironmentFilled width={18} height={18} />}>
                  <span className="sql-source-title">
                    {t('execWorkflow.audit.sqlFileSource.fileLine')}
                  </span>
                  {props?.sql_start_line || '-'}
                </BasicTag>
              </Space>
            }
          />
        </div>
        <AuditResultTree auditResult={auditResultWithNormalLevel} />

        <EmptyBox if={auditResultWithAuditException.length > 0}>
          <AuditExceptionTree
            auditExceptionResults={auditResultWithAuditException}
          />
        </EmptyBox>
      </div>
      <div className="result-card-footer">
        <Spin spinning={loading}>
          <ResultDescribe
            value={props.description || ''}
            onSubmit={updateSqlDescribe}
          />
        </Spin>
      </div>
    </TasksResultCardStyleWrapper>
  );
};
export default SqlMode;
