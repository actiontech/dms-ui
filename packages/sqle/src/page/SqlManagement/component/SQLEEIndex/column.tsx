import { t } from '../../../../locale';
import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  ActiontechTableActionMeta,
  ActiontechTableFilterMetaValue,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ModalName } from '../../../../data/ModalName';
import { IGetSqlManageListParams } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import {
  IAuditResult,
  ISource,
  ISqlManage
} from '@actiontech/shared/lib/api/sqle/service/common';
import RenderSQL from '../../../../components/RenderSQL';
import ResultIconRender from '../../../../components/AuditResultMessage/ResultIconRender';
import AuditResultMessage from '../../../../components/AuditResultMessage';
import { SourceTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Link } from 'react-router-dom';
import { sourceDictionary } from './hooks/useStaticStatus';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { BasicTag, EditText, EmptyBox } from '@actiontech/shared';
import { tooltipsCommonProps } from '@actiontech/shared/lib/components/BasicToolTips';
import { Space } from 'antd5';

// project_name
export type SqlManagementTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetSqlManageListParams,
  'fuzzy_search_sql_fingerprint' | 'filter_status' | 'project_name'
>;

// todo: filter data type
export const ExtraFilterMeta: () => ActiontechTableFilterMeta<
  ISqlManage & {
    filter_source?: string;
    filter_instance_name?: string;
    filter_audit_level?: string;
    time?: string;
  },
  SqlManagementTableFilterParamType
> = () => {
  return new Map<
    keyof (ISqlManage & {
      filter_source?: string;
      filter_instance_name?: string;
      filter_audit_level?: string;
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
    ]
  ]);
};

export const SqlManagementRowAction = (
  openModal: (name: ModalName, row?: ISqlManage) => void
): {
  buttons: ActiontechTableActionMeta<ISqlManage>[];
} => {
  return {
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
        }
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
        }
      }
    ]
  };
};

// todo: checkbox fixed 有一个 fixed left 的元素就行
const SqlManagementColumn: (
  projectID: string,
  actionPermission: boolean,
  updateRemark: (id: number, remark: string) => void,
  openModal: (name: ModalName, row?: ISqlManage) => void
) => ActiontechTableColumn<ISqlManage, SqlManagementTableFilterParamType> = (
  projectID,
  actionPermission,
  updateRemark,
  openModal
) => {
  return [
    {
      fixed: 'left',
      className: 'ellipsis-column-width',
      dataIndex: 'sql_fingerprint',
      title: () => t('sqlManagement.table.column.SQLFingerprint'),
      render: (sql_fingerprint) => {
        if (!sql_fingerprint) return null;
        return <RenderSQL sql={sql_fingerprint} rows={2} />;
      }
    },
    {
      fixed: 'left',
      dataIndex: 'sql',
      className: 'ellipsis-column-width',
      title: 'SQL',
      render: (sql) => {
        if (!sql) return null;
        return <RenderSQL sql={sql} rows={2} />;
      }
    },
    // todo: 需要跳转到不同的地方
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
          // todo: 路径有问题 -> sqle 审核需要往哪跳转 -> 新增的的页面
          /**
${
                source.sql_audit_record_ids?.join(
                  SQLAuditRecordIDValuesSplit
                ) ?? ''
              }`} */
          return (
            <Link to={`/sqle/project/${projectID}/sqlAudit/`}>
              {t(sourceDictionary[source.type])}
            </Link>
          );
        }
        return '--';
      }
    },
    // todo: 审核结果的 drawer 详情
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
      title: () => t('sqlManagement.table.column.instanceName')
    },
    {
      dataIndex: 'first_appear_time',
      title: () => t('sqlManagement.table.column.firstOccurrence'),
      render: (first_appear_time) => {
        return formatTime(first_appear_time, '-');
      }
    },
    {
      dataIndex: 'last_appear_time',
      title: () => t('sqlManagement.table.column.lastOccurrence'),
      render: (last_appear_time) => {
        return formatTime(last_appear_time, '-');
      }
    },
    {
      dataIndex: 'appear_num',
      align: 'right',
      title: () => t('sqlManagement.table.column.occurrenceCount')
    },
    // todo: 多个
    {
      dataIndex: 'assignees',
      title: () => t('sqlManagement.table.column.personInCharge'),
      width: 120,
      render: (assignees: string[]) => {
        if (!Array.isArray(assignees)) {
          return '--';
        }
        return (
          <Space size="small">
            {assignees.map((v) => (
              <BasicTag key={v}>{v}</BasicTag>
            ))}
          </Space>
        );
      }
    },
    // todo: 状态渲染, 渲染成撒样子
    {
      dataIndex: 'status',
      width: 160,
      title: () => t('sqlManagement.table.column.status')
    },
    {
      dataIndex: 'remark',
      width: 160,
      title: () => t('sqlManagement.table.column.comment'),
      render: (remark: string, record) => {
        return (
          <EmptyBox if={actionPermission} defaultNode={<>{remark ?? '--'}</>}>
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
                  ...tooltipsCommonProps(remark, 100)
                },
                rows: 1
              }}
            />
          </EmptyBox>
        );
      }
    }
  ];
};

export default SqlManagementColumn;
