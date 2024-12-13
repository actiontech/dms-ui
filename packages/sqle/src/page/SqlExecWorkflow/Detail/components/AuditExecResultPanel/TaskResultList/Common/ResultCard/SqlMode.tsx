import {
  BasicButton,
  BasicTag,
  BasicToolTips,
  Copy,
  EmptyBox,
  SQLRenderer,
  SegmentedTabs
} from '@actiontech/shared';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { ResponseCode } from '@actiontech/shared/lib/enum';
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
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { TaskResultContentTypeEnum } from './index.data';
import { BackupStrategyDictionary } from '../../../../../../Common/AuditResultList/Table/index.data';
import { UpdateSqlBackupStrategyReqStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { WarningFilled } from '@actiontech/icons';
import RollbackWorkflowEntry from './components/RollbackWorkflowEntry';
import { formatterSQL } from '@actiontech/shared/lib/utils/FormatterSQL';

const SqlMode: React.FC<SqlExecuteResultCardProps> = ({
  projectID,
  taskId,
  onUpdateDescription,
  ...props
}) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const { sqleTheme } = useThemeStyleData();

  const [loading, { setTrue: updateDescPending, setFalse: updateDescDone }] =
    useBoolean();

  const [currentContentKey, setCurrentContentKey] =
    useState<TaskResultContentTypeEnum>(TaskResultContentTypeEnum.exec_sql);

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
        }
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
    return props.rollback_sqls
      ?.map((v) => formatterSQL(v, props.dbType))
      ?.join('\n');
  }, [props.rollback_sqls, props.dbType]);

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
            <AuditResultTag auditResult={props.audit_result}></AuditResultTag>
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
                children: <SQLRenderer sql={props.exec_sql} showLineNumbers />
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
                      <Divider
                        type="vertical"
                        className="result-card-status-divider"
                      />
                      {props.backup_result ||
                        t('execWorkflow.audit.table.backupExecuteBeforeTips')}
                    </Space>
                    {/* #endif */}
                    <SQLRenderer sql={formattedRollbackSql} showLineNumbers />
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
                    <BasicToolTips
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
                    </BasicToolTips>
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
        <AuditResultTree auditResult={props.audit_result} />
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
