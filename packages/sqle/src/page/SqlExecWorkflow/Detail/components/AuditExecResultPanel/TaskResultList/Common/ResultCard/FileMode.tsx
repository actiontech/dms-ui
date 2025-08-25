import { Collapse, Divider, Space } from 'antd';
import { FileExecuteResultCardProps } from './index.type';
import ExecStatusTag from './components/ExecStatusTag';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import AuditResultTag from './components/AuditResultTag';
import { useMemo } from 'react';
import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { useRequest } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { useTableRequestError } from '@actiontech/shared/lib/components/ActiontechTable';
import SqlStatementResultTable from '../SqlStatementResultTable';
import { Trans } from 'react-i18next';
import { TasksResultCardStyleWrapper } from './style';
import { SqlFileOutlined } from '@actiontech/icons';
import { TypedLink } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const FileMode: React.FC<FileExecuteResultCardProps> = ({
  taskId,
  projectID,
  ...props
}) => {
  const auditResult = useMemo<IAuditResult[]>(() => {
    const res: IAuditResult[] = [];

    if (props.audit_result_count?.error_sql_count) {
      res.push(
        ...Array(props.audit_result_count.error_sql_count).fill({
          level: RuleResV1LevelEnum.error
        })
      );
    }

    if (props.audit_result_count?.notice_sql_count) {
      res.push(
        ...Array(props.audit_result_count.notice_sql_count).fill({
          level: RuleResV1LevelEnum.notice
        })
      );
    }

    if (props.audit_result_count?.warning_sql_count) {
      res.push(
        ...Array(props.audit_result_count.warning_sql_count).fill({
          level: RuleResV1LevelEnum.warn
        })
      );
    }

    return res;
  }, [
    props.audit_result_count?.error_sql_count,
    props.audit_result_count?.notice_sql_count,
    props.audit_result_count?.warning_sql_count
  ]);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const {
    data,
    loading,
    run: getSQLsInfo
  } = useRequest(
    () =>
      handleTableRequestError(
        task.getAuditTaskSQLsV2({
          task_id: taskId,
          filter_audit_file_id: Number(props.file_id),
          page_index: '1',
          page_size: '5'
        })
      ),
    {
      manual: true
    }
  );

  const items = useMemo(() => {
    return [
      {
        key: props.exec_order,
        label: (
          <div className="file-result-card-wrapper result-card-header">
            <Space size={32}>
              <span className="number">#{props.exec_order}</span>

              <div className="file-info">
                <SqlFileOutlined />
                <TypedLink
                  className="file-info-name"
                  to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.sql_files_overview}
                  params={{ projectID, taskId, fileId: props.file_id ?? '' }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {props.file_name}
                </TypedLink>
              </div>
            </Space>
            <div className="result-card-status-wrap">
              <ExecStatusTag
                status={
                  props.exec_status as getAuditTaskSQLsV2FilterExecStatusEnum
                }
              />
              <Divider type="vertical" className="result-card-status-divider" />
              <AuditResultTag auditResult={auditResult} />
            </div>
          </div>
        ),
        children: (
          <SqlStatementResultTable
            className="clear-padding-bottom"
            dataSource={data?.list ?? []}
            loading={loading}
            errorMessage={requestErrorMessage}
            pagination={false}
            taskId={taskId}
            caption={
              <div className="flex-display flex-end-horizontal">
                <Trans i18nKey={'audit.fileModeExecute.sqlsTips'}>
                  <TypedLink
                    to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.sql_files_overview}
                    params={{ projectID, taskId, fileId: props.file_id ?? '' }}
                    queries={{
                      instance_name: props.instanceName ?? '',
                      schema: props.schema ?? ''
                    }}
                  />
                </Trans>
              </div>
            }
            instanceName={props.instanceName}
            schema={props.schema}
          />
        )
      }
    ];
  }, [
    auditResult,
    data?.list,
    loading,
    projectID,
    props.exec_order,
    props.exec_status,
    props.file_id,
    props.file_name,
    requestErrorMessage,
    taskId,
    props.instanceName,
    props.schema
  ]);

  return (
    <TasksResultCardStyleWrapper>
      <Collapse
        onChange={(keys) => {
          if (keys.length > 0) {
            getSQLsInfo();
          }
        }}
        ghost
        items={items}
        className="file-result-collapse-wrapper"
      />
    </TasksResultCardStyleWrapper>
  );
};

export default FileMode;
