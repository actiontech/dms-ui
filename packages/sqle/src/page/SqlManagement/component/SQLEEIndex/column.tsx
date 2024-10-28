import { t } from '../../../../locale';
import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue,
  PageInfoWithoutIndexAndSize
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
import { SQLAuditRecordListUrlParamsKey } from './index.data';
import { SqlManageAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  PERMISSIONS,
  PermissionsConstantType
} from '@actiontech/shared/lib/global';

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

const SqlManagementColumn: (
  projectID: string,
  updateRemark: (id: number, remark: string) => void,
  openModal: (name: ModalName, row?: ISqlManage) => void,
  checkActionPermission: (
    requiredPermission: PermissionsConstantType
  ) => boolean
) => ActiontechTableColumn<ISqlManage, SqlManagementTableFilterParamType> = (
  projectID,
  updateRemark,
  openModal,
  checkActionPermission
) => {
  return [
    {
      className: 'ellipsis-column-width',
      dataIndex: 'sql_fingerprint',
      title: () => t('sqlManagement.table.column.SQLFingerprint'),
      width: 350,
      render: (sql_fingerprint, record) => {
        if (!sql_fingerprint) return null;
        return (
          <SQLRenderer.Snippet
            onClick={() => {
              if (
                record.audit_status !== SqlManageAuditStatusEnum.being_audited
              ) {
                openModal(ModalName.View_Audit_Result_Drawer, record);
              }
            }}
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
      width: 350,
      render: (sql, record) => {
        if (!sql) return null;
        return (
          <SQLRenderer.Snippet
            onClick={() => {
              if (
                record.audit_status !== SqlManageAuditStatusEnum.being_audited
              ) {
                openModal(ModalName.View_Audit_Result_Drawer, record);
              }
            }}
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
      width: 120,
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
            onClick={() => {
              if (
                record.audit_status !== SqlManageAuditStatusEnum.being_audited
              ) {
                openModal(ModalName.View_Audit_Result_Drawer, record);
              }
            }}
            className="audit-result-wrapper"
          >
            <ResultIconRender
              iconLevels={result?.map((item) => {
                return item.level ?? '';
              })}
              isAuditing={
                record.audit_status === SqlManageAuditStatusEnum.being_audited
              }
            />
          </div>
        );
      }
    },
    {
      dataIndex: 'instance_name',
      title: () => t('sqlManagement.table.column.instanceName'),
      width: 200,
      render: (instance_name) => {
        return instance_name || '-';
      }
    },
    {
      dataIndex: 'schema_name',
      title: () => 'Schema',
      width: 120,
      render: (schemaName) => {
        return schemaName || '-';
      }
    },
    {
      dataIndex: 'priority',
      title: () => t('sqlManagement.table.column.priority'),
      width: 80,
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
      width: 200,
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
      width: 100,
      className: 'audit-status',
      render: (status) => {
        if (!status) return '-';
        return <StatusTag status={status} />;
      }
    },
    {
      dataIndex: 'remark',
      title: () => t('sqlManagement.table.column.comment'),
      width: 200,
      className: 'ellipsis-column-width',
      render: (remark, record) => {
        if (
          !checkActionPermission(
            PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT.EDIT_REMARK
          )
        )
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
