import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetBlacklistV1Params } from '@actiontech/shared/lib/api/sqle/service/blacklist/index.d';
import { t } from '../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { SQLRenderer, BasicTypographyEllipsis } from '@actiontech/shared';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { BlacklistResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SqlManagementExceptionMatchTypeDirection } from '../index.data';

export type SqlManagementExceptionTableFilterParamType =
  PageInfoWithoutIndexAndSize<
    IGetBlacklistV1Params & {
      page_index: number;
      page_size: number;
    },
    'project_name'
  >;

export const SqlManagementExceptionListColumns: () => ActiontechTableColumn<
  IBlacklistResV1,
  IGetBlacklistV1Params
> = () => {
  return [
    {
      dataIndex: 'content',
      title: () => t('sqlManagementException.table.content'),
      className: 'ellipsis-column-width',
      render: (value, record) => {
        if (
          record.type === BlacklistResV1TypeEnum.sql ||
          record.type === BlacklistResV1TypeEnum.fp_sql
        ) {
          return (
            <SQLRenderer.Snippet
              sql={value}
              rows={2}
              showCopyIcon
              cuttingLength={200}
            />
          );
        }
        return value;
      }
    },
    {
      dataIndex: 'desc',
      title: () => t('sqlManagementException.table.desc'),
      className: 'ellipsis-column-width',
      render: (desc) => {
        if (!desc) return '-';
        return <BasicTypographyEllipsis textCont={desc} />;
      }
    },
    {
      dataIndex: 'type',
      title: () => t('sqlManagementException.table.matchType'),
      render: (type, record) => {
        return type ? SqlManagementExceptionMatchTypeDirection[type] : '-';
      },
      filterCustomType: 'select',
      filterKey: 'filter_type'
    },
    {
      dataIndex: 'matched_count',
      title: () => t('sqlManagementException.table.matchCount')
    },
    {
      dataIndex: 'last_match_time',
      title: () => t('sqlManagementException.table.lastMatchedTime'),
      render: (value) => {
        return formatTime(value, '-');
      }
    }
  ];
};

export const SqlManagementExceptionActions: (
  onUpdate: (record?: IBlacklistResV1) => void,
  onDelete: (id?: number) => void
) => {
  buttons: ActiontechTableActionMeta<IBlacklistResV1>[];
} = (onUpdate, onDelete) => {
  return {
    buttons: [
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
    ]
  };
};
