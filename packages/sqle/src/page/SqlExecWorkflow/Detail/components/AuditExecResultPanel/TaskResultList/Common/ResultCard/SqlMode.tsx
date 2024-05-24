import {
  BasicButton,
  BasicTag,
  BasicToolTips,
  Copy,
  EmptyBox,
  SQLRenderer
} from '@actiontech/shared';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import { Divider, Space, Spin, message } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import {
  IconArrowDown,
  IconFillListActive,
  IconPosition
} from '@actiontech/shared/lib/Icon/common';
import { SqlExecuteResultCardProps } from './index.type';
import ExecStatusTag from './components/ExecStatusTag';
import AuditResultTag from './components/AuditResultTag';
import AuditResultTree from './components/AuditResultTree';
import ResultDescribe from './components/ResultDescribe';
import {
  TaskResultSqlOptionsStyleWrapper,
  TasksResultCardStyleWrapper
} from './style';
import { TaskAuditResultTreeStyleWrapper } from './components/style';

const SqlMode: React.FC<SqlExecuteResultCardProps> = ({
  projectName,
  taskId,
  onUpdateDescription,
  ...props
}) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const [showExecSql, { setTrue, setFalse }] = useBoolean(true);

  const [loading, { set }] = useBoolean();

  const onCopyExecSql = () => {
    Copy.copyTextByTextarea(props.exec_sql ?? '');
    messageApi.success(t('common.copied'));
  };

  const onClickAnalyze = () => {
    window.open(
      `/sqle/project/${projectName}/exec-workflow/${taskId}/${props.number}/analyze`
    );
  };

  const updateSqlDescribe = (sqlDescribe: string) => {
    set(true);
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
        set(false);
      });
  };

  const sqlTemplate = useMemo(() => {
    const renderSql = (showExecSql ? props.exec_sql : props.rollback_sql) || '';
    return renderSql;
  }, [props.exec_sql, props.rollback_sql, showExecSql]);

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
          <Space size={0}>
            <TaskResultSqlOptionsStyleWrapper
              active={showExecSql}
              onClick={setTrue}
            >
              {t('execWorkflow.audit.table.execSql')}
            </TaskResultSqlOptionsStyleWrapper>
            <TaskResultSqlOptionsStyleWrapper
              active={!showExecSql}
              onClick={setFalse}
            >
              {t('execWorkflow.audit.table.rollback')}
            </TaskResultSqlOptionsStyleWrapper>
          </Space>

          <Space size={0}>
            <EmptyBox
              if={!!props?.sql_source_file}
              defaultNode={
                <BasicToolTips
                  title={t('execWorkflow.audit.sqlFileSource.tips')}
                >
                  <Space>
                    <BasicTag icon={<IconFillListActive />}>
                      <span className="sql-source-title">
                        {t('execWorkflow.audit.sqlFileSource.source')}
                      </span>
                      -
                    </BasicTag>
                  </Space>
                </BasicToolTips>
              }
            >
              <BasicTag icon={<IconFillListActive />}>
                <span className="sql-source-title">
                  {t('execWorkflow.audit.sqlFileSource.source')}
                </span>
                {props?.sql_source_file}
              </BasicTag>
            </EmptyBox>
            <BasicTag icon={<IconPosition />}>
              <span className="sql-source-title">
                {t('execWorkflow.audit.sqlFileSource.fileLine')}
              </span>
              {props?.sql_start_line || '-'}
            </BasicTag>
          </Space>
        </div>
        <SQLRenderer sql={sqlTemplate} showLineNumbers />
        <AuditResultTree auditResult={props.audit_result} />
        <TaskAuditResultTreeStyleWrapper
          treeData={[
            {
              title: t('execWorkflow.audit.table.execResult'),
              key: 'exec_result_wrap',
              children: [
                {
                  title: props.exec_result || '-',
                  key: 'exec_result'
                }
              ]
            }
          ]}
          switcherIcon={
            <IconArrowDown width={16} height={16} color="#C3C6CD" />
          }
        />
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
