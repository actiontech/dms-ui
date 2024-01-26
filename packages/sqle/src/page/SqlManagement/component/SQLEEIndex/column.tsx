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
import {
  IAuditResult,
  ISource,
  ISqlManage
} from '@actiontech/shared/lib/api/sqle/service/common';
import RenderSQL from '../../../../components/RenderSQL';
import ResultIconRender from '../../../../components/AuditResultMessage/ResultIconRender';
import AuditResultMessage from '../../../../components/AuditResultMessage';
import {
  SourceTypeEnum,
  SqlManageStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Link } from 'react-router-dom';
import { sourceDictionary } from './hooks/useStaticStatus';
import { AvatarCom, EditText } from '@actiontech/shared';
import { tooltipsCommonProps } from '@actiontech/shared/lib/components/BasicToolTips';
import { Avatar, Space } from 'antd';
import StatusTag from './StatusTag';
import {
  SQLAuditRecordIDValuesSplit,
  SQLAuditRecordListUrlParamsKey
} from './index.data';
import {
  BasicTag,
  BasicToolTips,
  BasicTypographyEllipsis
} from '@actiontech/shared';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH } from '@actiontech/shared/lib/components/ActiontechTable/hooks/useTableAction';

export type SqlManagementTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetSqlManageListV2Params,
  'fuzzy_search_sql_fingerprint' | 'filter_status' | 'project_name'
>;

export const ExtraFilterMeta: () => ActiontechTableFilterMeta<
  ISqlManage & {
    filter_source?: string;
    filter_instance_name?: string;
    filter_audit_level?: string;
    filter_rule_name?: string;
    time?: string;
  },
  SqlManagementTableFilterParamType
> = () => {
  return new Map<
    keyof (ISqlManage & {
      filter_source?: string;
      filter_instance_name?: string;
      filter_audit_level?: string;
      filter_rule_name?: string;
      time?: string;
    }),
    ActiontechTableFilterMetaValue<SqlManagementTableFilterParamType>
  >([
    [
      'filter_source',
      {
        filterCustomType: 'select',
        filterKey: 'filter_source',
        filterLabel: t('sqlManagement.table.column.source'),
        checked: false
      }
    ],
    [
      'filter_instance_name',
      {
        filterCustomType: 'select',
        filterKey: 'filter_instance_name',
        filterLabel: t('sqlManagement.table.column.instanceName'),
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
  operationPermission: boolean
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
      },
      {
        text: t('sqlManagement.table.action.analyze'),
        key: 'analyze-sql',
        buttonProps: (record) => {
          return {
            onClick: () => {
              jumpToAnalyze(record?.id?.toString() ?? '');
            }
          };
        }
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
          <RenderSQL
            onClick={() =>
              openModal(ModalName.View_Audit_Result_Drawer, record)
            }
            tooltip={true}
            sql={sql_fingerprint}
            rows={2}
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
          <RenderSQL
            onClick={() =>
              openModal(ModalName.View_Audit_Result_Drawer, record)
            }
            tooltip={false}
            sql={sql}
            rows={2}
          />
        );
      }
    },
    {
      dataIndex: 'source',
      title: () => t('sqlManagement.table.column.source'),
      render: (source: ISource) => {
        if (source.type && source.type === SourceTypeEnum.audit_plan) {
          return (
            <Link
              to={`/sqle/project/${projectID}/auditPlan/detail/${source.audit_plan_name}`}
            >
              {t(sourceDictionary[source.type])}
            </Link>
          );
        } else if (
          source.type &&
          source.type === SourceTypeEnum.sql_audit_record
        ) {
          return (
            <Link
              to={`/sqle/project/${projectID}/sqlAudit?${
                SQLAuditRecordListUrlParamsKey.SQLAuditRecordID
              }=${
                source.sql_audit_record_ids?.join(
                  SQLAuditRecordIDValuesSplit
                ) ?? ''
              }`}
            >
              {t(sourceDictionary[source.type])}
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
      render: (result: IAuditResult[], record) => {
        return (
          <div
            onClick={() =>
              openModal(ModalName.View_Audit_Result_Drawer, record)
            }
          >
            {result?.length > 1 ? (
              <ResultIconRender
                iconLevels={result.map((item) => {
                  return item.level ?? '';
                })}
              />
            ) : (
              <AuditResultMessage
                auditResult={
                  Array.isArray(result) && result.length ? result[0] : {}
                }
              />
            )}
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
      dataIndex: 'first_appear_timestamp',
      title: () => t('sqlManagement.table.column.firstOccurrence'),
      render: (value) => {
        return formatTime(value, '-');
      },
      sorter: true,
      sortDirections: ['descend', 'ascend']
    },
    {
      dataIndex: 'last_receive_timestamp',
      title: () => t('sqlManagement.table.column.lastOccurrence'),
      render: (value) => {
        return formatTime(value, '-');
      },
      sorter: true,
      sortDirections: ['descend', 'ascend']
    },
    {
      dataIndex: 'fp_count',
      align: 'right',
      title: () => t('sqlManagement.table.column.occurrenceCount'),
      sorter: true,
      sortDirections: ['descend', 'ascend']
    },
    {
      dataIndex: 'assignees',
      title: () => t('sqlManagement.table.column.personInCharge'),
      width: 200,
      render: (assignees: string[]) => {
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
      render: (endpoints: ISqlManage['endpoints']) => {
        if (!Array.isArray(endpoints) || endpoints.length === 0) {
          return '-';
        }

        return (
          <BasicToolTips
            title={
              endpoints.length > 1 ? (
                <Space wrap>
                  {endpoints.map((v) => (
                    <BasicTag key={v}>{v}</BasicTag>
                  ))}
                </Space>
              ) : null
            }
          >
            <BasicTag style={{ marginRight: 0 }}>{endpoints[0]}</BasicTag>
            {endpoints.length > 1 ? '...' : null}
          </BasicToolTips>
        );
      }
    },
    {
      dataIndex: 'status',
      title: () => t('sqlManagement.table.column.status'),
      render: (status: SqlManageStatusEnum) => {
        if (!status) return '-';
        return <StatusTag status={status} />;
      }
    },
    {
      dataIndex: 'remark',
      title: () => t('sqlManagement.table.column.comment'),
      className: 'ellipsis-column-width',
      render: (remark: string, record) => {
        if (!hasPermissionAndNotArchive)
          return remark ? <BasicTypographyEllipsis textCont={remark} /> : '-';
        return (
          <EditText
            value={remark}
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
