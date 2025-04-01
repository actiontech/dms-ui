import { t } from '../../../../../locale';
import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  SQLRenderer,
  EditText,
  BasicTag,
  basicTooltipCommonProps
} from '@actiontech/shared';
import { ExpandedBackupSqlType } from './index.type';
import { IGetBackupSqlListV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import ExecStatusTag from '../AuditExecResultPanel/TaskResultList/Common/ResultCard/components/ExecStatusTag';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { BackupStrategyDictionary } from '../../../Common/AuditResultList/Table/index.data';
import { UpdateSqlBackupStrategyReqStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SqlBackupStatusDictionary } from './index.data';

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
      dataIndex: 'backup_strategy',
      title: t('execWorkflow.detail.rollback.backupStrategy'),
      width: 150,
      render: (strategy) => {
        return strategy ? (
          <BasicTag>
            {
              BackupStrategyDictionary[
                strategy as unknown as UpdateSqlBackupStrategyReqStrategyEnum
              ]
            }
          </BasicTag>
        ) : (
          '-'
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
    },
    {
      dataIndex: 'backup_status',
      title: t('execWorkflow.detail.rollback.backupStatus'),
      width: 100,
      render: (status) => {
        return status ? SqlBackupStatusDictionary[status] : '-';
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
