import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IListCBOperationLogsParams } from '@actiontech/shared/lib/api/base/service/CBOperationLogs/index.d';
import { ICBOperationLog } from '@actiontech/shared/lib/api/base/service/common';
import { t } from '../../../locale';
import { formatTime, ROUTE_PATHS } from '@actiontech/dms-kit';
import ResultIconRender from 'sqle/src/components/AuditResultMessage/ResultIconRender';
import { OperationOperationTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { CustomAvatar } from '@actiontech/dms-kit';
import {
  SQLRenderer,
  BasicTypographyEllipsis,
  TypedLink
} from '@actiontech/shared';
export type CBOperationListFilterParamType = PageInfoWithoutIndexAndSize<
  IListCBOperationLogsParams & {
    page_index: number;
  },
  'project_uid'
>;
export const CBOperationListColumns = (
  projectID: string,
  onOpenDrawer: (record: ICBOperationLog) => void
): ActiontechTableColumn<ICBOperationLog, CBOperationListFilterParamType> => {
  return [
    {
      dataIndex: 'operation_person',
      title: t('dmsCloudBeaver.operationList.column.operationUser'),
      render: (value: ICBOperationLog['operation_person']) => {
        return <CustomAvatar size="small" name={value?.name ?? ''} />;
      },
      filterCustomType: 'select',
      filterKey: 'filter_operation_person_uid'
    },
    {
      dataIndex: 'operation_time',
      title: t('dmsCloudBeaver.operationList.column.operationTime'),
      render: (value: ICBOperationLog['operation_time']) => {
        return value ? formatTime(value) : '-';
      },
      filterCustomType: 'date-range',
      filterKey: ['filter_operation_time_from', 'filter_operation_time_to']
    },
    {
      dataIndex: 'db_service',
      title: t('dmsCloudBeaver.operationList.column.service'),
      render: (value: ICBOperationLog['db_service']) => {
        return value?.name ?? '-';
      },
      filterCustomType: 'select',
      filterKey: 'filter_db_service_uid'
    },
    {
      dataIndex: 'operation',
      title: t('dmsCloudBeaver.operationList.column.operationDetail'),
      className: 'ellipsis-column-width',
      render: (operation: ICBOperationLog['operation'], record) => {
        if (operation?.operation_type === OperationOperationTypeEnum.SQL) {
          return (
            <SQLRenderer.Snippet
              onClick={() => onOpenDrawer(record)}
              sql={operation.operation_detail}
              rows={1}
              tooltip={false}
              showCopyIcon
              cuttingLength={200}
            />
          );
        }
        return operation?.operation_detail ?? '-';
      }
    },
    {
      dataIndex: 'workflow_id',
      title: t('dmsCloudBeaver.operationList.column.relatedWorkflow'),
      render: (value: ICBOperationLog['workflow_id']) => {
        if (!value) {
          return '-';
        }
        return (
          <TypedLink
            target="_blank"
            to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail}
            params={{
              projectID,
              workflowId: value
            }}
          >
            {value}
          </TypedLink>
        );
      }
    },
    {
      dataIndex: 'session_id',
      title: t('dmsCloudBeaver.operationList.column.sessionId'),
      render: (value: ICBOperationLog['session_id']) => {
        return (
          <BasicTypographyEllipsis
            tooltipsMaxWidth={500}
            textCont={value ?? '-'}
          />
        );
      },
      className: 'ellipsis-column-width'
    },
    {
      dataIndex: 'operation_ip',
      title: t('dmsCloudBeaver.operationList.column.operationIP'),
      render: (value: ICBOperationLog['operation_ip']) => {
        return value ?? '-';
      }
    },
    {
      dataIndex: 'audit_result',
      title: t('dmsCloudBeaver.operationList.column.auditResult'),
      className: 'ellipsis-column-width',
      render: (result: ICBOperationLog['audit_result'], record) => {
        if (
          record.operation?.operation_type !== OperationOperationTypeEnum.SQL
        ) {
          return '-';
        }
        return (
          <div
            onClick={() => onOpenDrawer(record)}
            className="audit-result-wrapper"
          >
            <ResultIconRender
              auditResultInfo={result?.map((item) => ({
                level: item.level ?? '',
                executionFailed: !!item.execution_failed
              }))}
            />
          </div>
        );
      }
    },
    {
      dataIndex: 'exec_result',
      title: t('dmsCloudBeaver.operationList.column.execResult'),
      className: 'ellipsis-column-width',
      render: (result: ICBOperationLog['exec_result']) => {
        if (!result) {
          return '-';
        }
        return (
          <BasicTypographyEllipsis tooltipsMaxWidth={500} textCont={result} />
        );
      },
      filterCustomType: 'select',
      filterKey: 'filter_exec_result'
    },
    {
      dataIndex: 'exec_time_second',
      title: t('dmsCloudBeaver.operationList.column.execTime'),
      render: (value: ICBOperationLog['exec_time_second']) => {
        return value ?? '-';
      }
    },
    {
      dataIndex: 'result_set_row_count',
      title: t('dmsCloudBeaver.operationList.column.rowCount'),
      render: (value: ICBOperationLog['result_set_row_count']) => {
        return value ?? '-';
      }
    }
  ];
};
