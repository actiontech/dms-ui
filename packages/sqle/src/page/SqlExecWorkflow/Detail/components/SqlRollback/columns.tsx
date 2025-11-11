import { t } from '../../../../../locale';
import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { EditText } from '@actiontech/dms-kit';
import { SQLRenderer } from '@actiontech/shared';
import { basicTooltipCommonProps } from '@actiontech/dms-kit/es/components/BasicToolTip/utils';
import { ExpandedBackupSqlType } from './index.type';
import { IGetBackupSqlListV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import ExecStatusTag from '../AuditExecResultPanel/TaskResultList/Common/ResultCard/components/ExecStatusTag';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';

export type WorkflowRollbackSqlTableFilterParamType =
  PageInfoWithoutIndexAndSize<
    IGetBackupSqlListV1Params & {
      page_index: number;
      page_size: number;
    },
    'project_name' | 'workflow_id'
  >;
export const WorkflowRollbackSqlTableColumn: () => ActiontechTableColumn<
  ExpandedBackupSqlType,
  WorkflowRollbackSqlTableFilterParamType
> = () => {
  return [
    {
      dataIndex: 'origin_sql',
      title: 'SQL',
      className: 'ellipsis-column-width',
      width: 350,
      render: (sql_fingerprint) => {
        if (!sql_fingerprint) return null;
        return (
          <SQLRenderer.Snippet
            sql={sql_fingerprint}
            rows={2}
            showCopyIcon
            cuttingLength={200}
            tooltip={false}
          />
        );
      }
    },
    {
      dataIndex: 'instance_name',
      title: t('execWorkflow.detail.rollback.instance'),
      filterCustomType: 'select',
      filterKey: 'filter_instance_id',
      width: 120
    },
    {
      dataIndex: 'exec_status',
      title: t('execWorkflow.detail.rollback.execStatus'),
      filterCustomType: 'select',
      filterKey: 'filter_exec_status',
      width: 100,
      render: (status) => {
        return (
          <ExecStatusTag
            status={status as getAuditTaskSQLsV2FilterExecStatusEnum}
          />
        );
      }
    }
  ];
};
export const WorkflowRollbackSelectedSqlTableColumn: (
  onUpdateSqlRemake: (id: string, remake?: string) => void
) => ActiontechTableColumn<ExpandedBackupSqlType> = (onUpdateSqlRemake) => {
  const baseColumns = WorkflowRollbackSqlTableColumn();
  return [
    ...baseColumns,
    {
      dataIndex: 'remark',
      title: t('execWorkflow.detail.rollback.remark'),
      width: 150,
      className: 'rollback-remark-column',
      render: (remark, record) => {
        return (
          <EditText
            editButtonProps={{
              children: t('execWorkflow.detail.rollback.addRemark'),
              size: 'small'
            }}
            editable={{
              autoSize: true,
              onEnd: (val) => {
                onUpdateSqlRemake(record.id ?? '', val);
              }
            }}
            ellipsis={{
              expandable: false,
              tooltip: {
                arrow: false,
                ...basicTooltipCommonProps(remark, 500)
              },
              rows: 1
            }}
            value={remark ?? ''}
          />
        );
      }
    }
  ];
};
