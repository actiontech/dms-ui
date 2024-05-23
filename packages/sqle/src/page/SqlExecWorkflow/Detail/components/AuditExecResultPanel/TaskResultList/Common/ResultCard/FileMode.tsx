import { Collapse, Divider, Space } from 'antd';
import { FileExecuteResultCardProps } from './index.type';
import ExecStatusTag from './components/ExecStatusTag';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { IconFile } from '@actiontech/shared/lib/Icon/common';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import AuditResultTag from './components/AuditResultTag';
import { useMemo } from 'react';
import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { useRequest } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { useTableRequestError } from '@actiontech/shared/lib/components/ActiontechTable';
import SQLStatementResultTable from '../SQLStatementResultTable';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TasksResultCardStyleWrapper } from './style';

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
                <IconFile />
                <Link
                  className="file-info-name"
                  to={`/sqle/project/${projectID}/exec-workflow/${taskId}/files/${props.file_id}/sqls`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {props.file_name}
                </Link>
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
          <SQLStatementResultTable
            dataSource={data?.list ?? []}
            loading={loading}
            errorMessage={requestErrorMessage}
            pagination={false}
            caption={
              <div className="flex-display flex-end-horizontal">
                <Trans i18nKey={'audit.fileModeExecute.sqlsTips'}>
                  <Link
                    to={`/sqle/project/${projectID}/order/${taskId}/files/${props.file_id}/sqls`}
                  />
                </Trans>
              </div>
            }
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
    taskId
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
