import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetBlacklistV1Params } from '@actiontech/shared/lib/api/sqle/service/blacklist/index.d';
import { t } from '../../../locale';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  SqlManagementExceptionBaseMatchTypeOptions,
  SqlManagementExceptionRuleScopeFilterOptions
} from '../index.data';
import {
  MatchModeDisplay,
  RuleScopeDisplay
} from '../../../components/RuleException';

export type SqlManagementExceptionTableFilterParamType =
  PageInfoWithoutIndexAndSize<
    IGetBlacklistV1Params & {
      page_index: number;
      page_size: number;
    },
    'project_name'
  >;

export const SqlManagementExceptionListFilterMeta: () => ActiontechTableFilterMeta<
  IBlacklistResV1,
  IGetBlacklistV1Params
> = () => {
  return new Map<
    keyof IBlacklistResV1,
    ActiontechTableFilterMetaValue<IGetBlacklistV1Params>
  >([
    [
      'type',
      {
        filterCustomType: 'select',
        filterKey: 'filter_type',
        filterLabel: t('ruleException.table.matchMode'),
        checked: false
      }
    ],
    [
      'rule_scope_mode',
      {
        filterCustomType: 'select',
        filterKey: 'filter_rule_scope_mode',
        filterLabel: t('ruleException.table.ruleScope'),
        checked: false
      }
    ],
    [
      'created_by',
      {
        filterCustomType: 'input',
        filterKey: 'filter_created_by',
        filterLabel: t('ruleException.table.createdBy'),
        checked: false
      }
    ],
    [
      'created_at',
      {
        filterCustomType: 'date-range',
        filterKey: ['filter_created_at_from', 'filter_created_at_to'],
        filterLabel: t('ruleException.table.createdAt'),
        checked: false
      }
    ]
  ]);
};

export const SqlManagementExceptionListColumns = (): ActiontechTableColumn<
  IBlacklistResV1,
  IGetBlacklistV1Params
> => [
  {
    dataIndex: 'type',
    title: () => t('ruleException.table.matchMode'),
    className: 'ellipsis-column-width',
    render: (_, record) => <MatchModeDisplay record={record} labelsOnly />
  },
  {
    dataIndex: 'rule_scope_mode',
    title: () => t('ruleException.table.ruleScope'),
    render: (_, record) => <RuleScopeDisplay record={record} modeOnly />
  },
  {
    dataIndex: 'desc',
    title: () => t('ruleException.table.reason'),
    className: 'ellipsis-column-width',
    render: (desc) => {
      if (!desc) return '-';
      return <BasicTypographyEllipsis textCont={desc} />;
    }
  },
  {
    dataIndex: 'created_by',
    title: () => t('ruleException.table.createdBy')
  },
  {
    dataIndex: 'created_at',
    title: () => t('ruleException.table.createdAt'),
    render: (value) => formatTime(value, '-')
  },
  {
    dataIndex: 'matched_count',
    title: () => t('sqlManagementException.table.matchCount')
  }
];

export const SqlManagementExceptionActions: (
  onView: (record?: IBlacklistResV1) => void,
  onUpdate: (record?: IBlacklistResV1) => void,
  onDelete: (id?: number) => void,
  canWrite?: boolean
) => {
  buttons: ActiontechTableActionMeta<IBlacklistResV1>[];
} = (onView, onUpdate, onDelete, canWrite = true) => {
  const buttons: ActiontechTableActionMeta<IBlacklistResV1>[] = [
    {
      key: 'view-button',
      text: t('ruleException.skippedSection.viewDetail'),
      buttonProps: (record) => ({
        onClick: () => onView(record)
      })
    }
  ];

  if (canWrite) {
    buttons.push(
      {
        key: 'edit-button',
        text: t('common.edit'),
        buttonProps: (record) => ({
          onClick: () => onUpdate(record)
        })
      },
      {
        key: 'delete-button',
        text: t('common.delete'),
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('sqlManagementException.operate.confirmDelete'),
          onConfirm: () => onDelete(record?.blacklist_id)
        })
      }
    );
  }

  return { buttons };
};

export const SqlManagementExceptionFilterCustomProps = () =>
  new Map([
    ['type', { options: SqlManagementExceptionBaseMatchTypeOptions }],
    [
      'rule_scope_mode',
      { options: SqlManagementExceptionRuleScopeFilterOptions }
    ]
  ] as const);
