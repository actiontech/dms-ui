import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetSqlVersionListV1Params } from '@actiontech/shared/lib/api/sqle/service/sql_version/index.d';
import { t } from '../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { ISqlVersionResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { VersionStatusDictionary } from '../index.data';
import { Link } from 'react-router-dom';
import { SqlVersionResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type VersionManagementTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetSqlVersionListV1Params,
  'project_name'
>;

export const VersionManagementTableColumns: (
  projectID: string
) => ActiontechTableColumn<ISqlVersionResV1, IGetSqlVersionListV1Params> = (
  projectID
) => {
  return [
    {
      dataIndex: 'version',
      title: () => t('versionManagement.list.column.name'),
      className: 'ellipsis-column-width',
      render: (value, record) => {
        return (
          <Link
            to={`/sqle/project/${projectID}/version-management/detail/${record.version_id}`}
          >
            {value}
          </Link>
        );
      }
    },
    {
      dataIndex: 'desc',
      title: () => t('versionManagement.list.column.desc'),
      className: 'ellipsis-column-width',
      render: (desc) => {
        if (!desc) return '-';
        return <BasicTypographyEllipsis textCont={desc} />;
      }
    },
    {
      dataIndex: 'status',
      title: () => t('versionManagement.list.column.status'),
      render: (status, record) => {
        return VersionStatusDictionary[status!];
      }
    },
    {
      dataIndex: 'created_at',
      title: () => t('versionManagement.list.column.createTime'),
      render: (value) => {
        return formatTime(value, '-');
      },
      filterCustomType: 'date-range',
      filterKey: ['filter_by_created_at_from', 'filter_by_created_at_to']
    },
    {
      dataIndex: 'lock_time',
      title: () => t('versionManagement.list.column.lockTime'),
      render: (value) => {
        return formatTime(value, '-');
      },
      filterCustomType: 'date-range',
      filterKey: ['filter_by_lock_time_from', 'filter_by_lock_time_to']
    }
  ];
};

export const VersionManagementTableActions: (
  onEdit: (id?: number) => void,
  onDelete: (id?: number) => void,
  onLock: (id?: number) => void
) => {
  buttons: ActiontechTableActionMeta<ISqlVersionResV1>[];
} = (onEdit, onDelete, onLock) => {
  return {
    buttons: [
      {
        key: 'edit-button',
        text: t('common.edit'),
        buttonProps: (record) => ({
          onClick: () => onEdit(record?.version_id)
        }),
        permissions: (record) =>
          record?.status === SqlVersionResV1StatusEnum.is_being_released
      },
      {
        key: 'lock-button',
        text: t('versionManagement.list.action.lock'),
        confirm: (record) => ({
          title: t('versionManagement.list.action.lockConfirm'),
          onConfirm: () => onLock(record?.version_id)
        }),
        permissions: (record) =>
          !!record?.lockable &&
          record?.status !== SqlVersionResV1StatusEnum.locked
      },
      {
        key: 'delete-button',
        text: t('common.delete'),
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('versionManagement.list.action.deleteConfirm'),
          onConfirm: () => onDelete(record?.version_id)
        }),
        permissions: (record) => !!record?.deletable
      }
    ]
  };
};
