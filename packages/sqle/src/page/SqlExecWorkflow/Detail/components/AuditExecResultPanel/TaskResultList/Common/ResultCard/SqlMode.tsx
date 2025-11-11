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
import RollbackWorkflowEntry from './components/RollbackWorkflowEntry';
import AuditExceptionTree from './components/AuditExceptionTree';
import { IAuditResultItem } from '../../../../../../../../components/ReportDrawer/index.type';
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
