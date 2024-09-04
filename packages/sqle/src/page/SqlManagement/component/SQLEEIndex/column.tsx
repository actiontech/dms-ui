import { t } from '../../../../locale';
import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue,
  PageInfoWithoutIndexAndSize,
  ActiontechTableProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ModalName } from '../../../../data/ModalName';
import { IGetSqlManageListV2Params } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import ResultIconRender from '../../../../components/AuditResultMessage/ResultIconRender';
import { Link } from 'react-router-dom';
import { AvatarCom, EditText, SQLRenderer } from '@actiontech/shared';
import { tooltipsCommonProps } from '@actiontech/shared/lib/components/BasicToolTips';
import { Avatar } from 'antd';
import StatusTag from './StatusTag';
import { BasicTag, BasicTypographyEllipsis } from '@actiontech/shared';
import { ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH } from '@actiontech/shared/lib/components/ActiontechTable/hooks/useTableAction';
import { SQLAuditRecordListUrlParamsKey } from './index.data';

export type SqlManagementTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetSqlManageListV2Params,
  'fuzzy_search_sql_fingerprint' | 'filter_status' | 'project_name'
>;

export type ExtraFilterMetaType = ISqlManage & {
  filter_business?: string;
  filter_source?: string;
  filter_instance_id?: string;
  filter_audit_level?: string;
  filter_rule_name?: string;
  time?: string;
};

export const ExtraFilterMeta: () => ActiontechTableFilterMeta<
  ExtraFilterMetaType,
  SqlManagementTableFilterParamType
> = () => {
  return new Map<
    keyof ExtraFilterMetaType,
    ActiontechTableFilterMetaValue<SqlManagementTableFilterParamType>
  >([
    [
      'filter_business',
      {
        filterCustomType: 'select',
        filterKey: 'filter_business',
        filterLabel: t('sqlManagement.table.filter.business'),
        checked: false
      }
    ],
    [
      'filter_instance_id',
      {
        filterCustomType: 'select',
        filterKey: 'filter_instance_id',
        filterLabel: t('sqlManagement.table.filter.instanceName'),
        checked: false
      }
    ],
    [
      'filter_source',
      {
        filterCustomType: 'select',
        filterKey: 'filter_source',
        filterLabel: t('sqlManagement.table.filter.source.label'),
        checked: false
      }
    ],
    [
      'filter_audit_level',
      {
        filterCustomType: 'select',
        filterKey: 'filter_audit_level',
        filterLabel: t('sqlManagement.table.filter.auditLevel.label'),
        checked: false
      }
    ],
    [
      'time',
      {
        filterCustomType: 'date-range',
        filterKey: [
          'filter_last_audit_start_time_from',
          'filter_last_audit_start_time_to'
        ],
        filterLabel: t('sqlManagement.table.filter.time'),
        checked: false
      }
    ],
    [
      'filter_rule_name',
      {
        filterCustomType: 'select',
        filterKey: 'filter_rule_name',
        filterLabel: t('sqlManagement.table.filter.rule'),
        checked: false
      }
    ]
  ]);
};

export const SqlManagementRowAction = (
  openModal: (name: ModalName, row?: ISqlManage) => void,
  jumpToAnalyze: (sqlManageID: string) => void,
  operationPermission: boolean,
  openCreateSqlManagementExceptionModal: (record?: ISqlManage) => void,
  onCreateWhitelist: (record?: ISqlManage) => void
): ActiontechTableProps<ISqlManage>['actions'] => {
  return {
    width: operationPermission
      ? ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH * 3
      : ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH,
    buttons: [
      {
        text: t('sqlManagement.table.action.single.assignment'),
        key: 'assignment-single',
        buttonProps: (record) => {
          return {
            onClick: () => {
              openModal(ModalName.Assignment_Member_Single, record);
            }
          };
        },
        permissions: () => operationPermission
      },
      {
        text: t('sqlManagement.table.action.single.updateStatus.triggerText'),
        key: 'change-status-single',
        buttonProps: (record) => {
          return {
            onClick: () => {
              openModal(ModalName.Change_Status_Single, record);
            }
          };
        },
        permissions: () => operationPermission
      }
    ],
    moreButtons: [
      {
        text: t('sqlManagement.table.action.single.updatePriority.triggerText'),
        key: 'change-priority-single',
        onClick: (record) => {
          openModal(ModalName.Change_SQL_Priority, record);
        },
        permissions: () => operationPermission
      },
      {
        text: t('sqlManagement.table.action.analyze'),
        key: 'analyze-sql',
        onClick: (record) => {
          jumpToAnalyze(record?.id?.toString() ?? '');
        }
      },
      {
        text: t('sqlManagement.table.action.createSqlManagementException'),
        key: 'create-exception',
        onClick: (record) => {
          openCreateSqlManagementExceptionModal(record);
        },
        permissions: () => operationPermission
      },
      {
        text: t('sqlManagement.table.action.createWhitelist'),
        key: 'create-whitelist',
        onClick: (record) => {
          onCreateWhitelist(record);
        },
        permissions: () => operationPermission
      }
    ]
  };
};

const SqlManagementColumn: (
  projectID: string,
  hasPermissionAndNotArchive: boolean,
  updateRemark: (id: number, remark: string) => void,
  openModal: (name: ModalName, row?: ISqlManage) => void
) => ActiontechTableColumn<ISqlManage, SqlManagementTableFilterParamType> = (
  projectID,
  hasPermissionAndNotArchive,
  updateRemark,
  openModal
) => {
  return [
    {
      className: 'ellipsis-column-width',
      dataIndex: 'sql_fingerprint',
      title: () => t('sqlManagement.table.column.SQLFingerprint'),
      render: (sql_fingerprint, record) => {
        if (!sql_fingerprint) return null;
        return (
          <SQLRenderer.Snippet
            onClick={() =>
              openModal(ModalName.View_Audit_Result_Drawer, record)
            }
            tooltip={false}
            sql={sql_fingerprint}
            rows={2}
            showCopyIcon
            cuttingLength={200}
          />
        );
      }
    },
    {
      dataIndex: 'sql',
      className: 'ellipsis-column-width',
      title: 'SQL',
      render: (sql, record) => {
        if (!sql) return null;
        return (
          <SQLRenderer.Snippet
            onClick={() =>
              openModal(ModalName.View_Audit_Result_Drawer, record)
            }
            tooltip={false}
            sql={sql}
            rows={2}
            showCopyIcon
            cuttingLength={200}
          />
        );
      }
    },
    {
      dataIndex: 'source',
      title: () => t('sqlManagement.table.column.source'),
      render: (source) => {
        if (
          !!source &&
          !!source.sql_source_ids &&
          source.sql_source_ids.length > 0 &&
          !!source.sql_source_type
        ) {
          if (source.sql_source_type === 'sql_audit_record') {
            return (
              <Link
                target="_blank"
                to={`/sqle/project/${projectID}/sql-audit?${
                  SQLAuditRecordListUrlParamsKey.SQLAuditRecordID
                }=${source.sql_source_ids.join(',')}`}
              >
                {source.sql_source_desc}
              </Link>
            );
          }
          return (
            <Link
              target="_blank"
              to={`/sqle/project/${projectID}/sql-management-conf/${source.sql_source_ids[0]}`}
            >
              {source.sql_source_desc ?? source.sql_source_type}
            </Link>
          );
        }
        return '-';
      }
    },
    {
      dataIndex: 'audit_result',
      width: 200,
      title: () => t('sqlManagement.table.column.auditResult'),
      render: (result = [], record) => {
        return (
          <div
            onClick={() =>
              openModal(ModalName.View_Audit_Result_Drawer, record)
            }
            className="audit-result-wrapper"
          >
            <ResultIconRender
              iconLevels={result.map((item) => {
                return item.level ?? '';
              })}
            />
          </div>
        );
      }
    },
    {
      dataIndex: 'instance_name',
      title: () => t('sqlManagement.table.column.instanceName'),
      render: (instance_name) => {
        return instance_name || '-';
      }
    },
    {
      dataIndex: 'schema_name',
      title: () => 'Schema',
      render: (schemaName) => {
        return schemaName || '-';
      }
    },
    {
      dataIndex: 'priority',
      title: () => t('sqlManagement.table.column.priority'),
      render: (priority) => {
        if (priority === 'high') {
          return t('sqlManagement.table.column.highPriority');
        }
        if (priority === 'low') {
          return t('sqlManagement.table.column.lowPriority');
        }

        return '-';
      }
    },
    // {
    //   dataIndex: 'first_appear_timestamp',
    //   title: () => t('sqlManagement.table.column.firstOccurrence'),
    //   render: (value) => {
    //     return formatTime(value, '-');
    //   },
    //   sorter: true,
    //   sortDirections: ['descend', 'ascend']
    // },
    // {
    //   dataIndex: 'last_receive_timestamp',
    //   title: () => t('sqlManagement.table.column.lastOccurrence'),
    //   render: (value) => {
    //     return formatTime(value, '-');
    //   },
    //   sorter: true,
    //   sortDirections: ['descend', 'ascend']
    // },
    // {
    //   dataIndex: 'fp_count',
    //   align: 'right',
    //   title: () => t('sqlManagement.table.column.occurrenceCount'),
    //   sorter: true,
    //   sortDirections: ['descend', 'ascend']
    // },
    {
      dataIndex: 'assignees',
      title: () => t('sqlManagement.table.column.personInCharge'),
      width: 200,
      render: (assignees) => {
        if (!Array.isArray(assignees)) {
          return '-';
        }
        if (assignees.length === 1) {
          return <AvatarCom key={assignees[0]} name={assignees[0]} />;
        }
        return (
          <Avatar.Group maxCount={4}>
            {assignees.map((v) => (
              <AvatarCom key={v} name={v} />
            ))}
          </Avatar.Group>
        );
      }
    },
    {
      dataIndex: 'endpoints',
      title: () => t('sqlManagement.table.column.endpoints'),
      render: (endpoints) => {
        if (!endpoints) {
          return '-';
        }
        // todo 暂时调整成 string
        return <BasicTag style={{ marginRight: 0 }}>{endpoints}</BasicTag>;
      }
    },
    {
      dataIndex: 'status',
      title: () => t('sqlManagement.table.column.status'),
      render: (status) => {
        if (!status) return '-';
        return <StatusTag status={status} />;
      }
    },
    {
      dataIndex: 'remark',
      title: () => t('sqlManagement.table.column.comment'),
      className: 'ellipsis-column-width',
      render: (remark, record) => {
        if (!hasPermissionAndNotArchive)
          return remark ? <BasicTypographyEllipsis textCont={remark} /> : '-';
        return (
          <EditText
            value={remark ?? ''}
            editable={{
              autoSize: true,
              onEnd: (val) => {
                updateRemark(record.id ?? 0, val);
              }
            }}
            ellipsis={{
              expandable: false,
              tooltip: {
                arrow: false,
                ...tooltipsCommonProps(remark, 250)
              },
              rows: 1
            }}
          />
        );
      }
    }
  ];
};

export default SqlManagementColumn;
