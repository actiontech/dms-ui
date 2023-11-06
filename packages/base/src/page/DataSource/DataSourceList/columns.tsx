import { timeAddZero } from '@actiontech/shared/lib/utils/Common';
import { Tag } from 'antd5';
import { t } from '../../../locale';
import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableActionMeta,
  ActiontechTableColumn,
  InlineActiontechTableMoreActionsButtonMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';

export const DataSourceColumns = (): ActiontechTableColumn<
  IListDBService,
  undefined,
  'address'
> => {
  return [
    {
      dataIndex: 'name',
      title: () => t('dmsDataSource.databaseList.instanceName')
    },
    {
      dataIndex: 'address',
      title: () => t('dmsDataSource.databaseList.address'),
      render(_, record) {
        if (!record.host || !record.port) {
          return '-';
        }
        return `${record.host}:${record.port}`;
      }
    },
    {
      dataIndex: 'source',
      title: () => t('dmsDataSource.databaseList.source')
    },
    {
      dataIndex: 'desc',
      title: () => t('dmsDataSource.databaseList.describe'),
      className: 'ellipsis-column-width',
      render: (desc: string) => {
        return desc ? <BasicTypographyEllipsis textCont={desc} /> : '-';
      }
    },
    {
      dataIndex: 'db_type',
      title: () => t('dmsDataSource.databaseList.type')
    },
    {
      dataIndex: 'business',
      title: () => t('dmsDataSource.databaseList.business')
    },
    {
      dataIndex: 'maintenance_times',
      title: () => t('dmsDataSource.databaseList.maintenanceTime'),
      render(value: IListDBService['maintenance_times']) {
        return value?.map((t, i) => (
          <Tag key={i}>
            {timeAddZero(t.maintenance_start_time?.hour ?? 0)}:
            {timeAddZero(t.maintenance_start_time?.minute ?? 0)} -
            {timeAddZero(t.maintenance_stop_time?.hour ?? 0)}:
            {timeAddZero(t.maintenance_stop_time?.minute ?? 0)}
          </Tag>
        ));
      }
    }
  ];
};

export const DataSourceListActions = (
  onNavigateUpdateDataSource: (uid: string) => void,
  onDeleteDataSource: (uid: string, name: string) => void,
  onTestConnection: (uid: string, name: string) => void,
  isArchive: boolean,
  actionPermission: boolean
): {
  title?: ActiontechTableColumn<IListDBService>[0]['title'];
  moreButtons?: InlineActiontechTableMoreActionsButtonMeta<IListDBService>[];
  buttons: ActiontechTableActionMeta<IListDBService>[];
} => {
  return !isArchive && actionPermission
    ? {
        buttons: [
          {
            key: 'edit-DataSource',
            text: t('common.edit'),
            buttonProps: (record) => ({
              onClick: onNavigateUpdateDataSource.bind(null, record?.uid ?? '')
            })
          },
          {
            key: 'remove-DataSource',
            text: t('common.delete'),
            buttonProps: () => ({ danger: true }),
            confirm: (record) => ({
              title: t('dmsDataSource.deleteDatabase.confirmMessage', {
                name: record?.name
              }),
              onConfirm: onDeleteDataSource.bind(
                null,
                record?.uid ?? '',
                record?.name ?? ''
              )
            })
          }
        ],
        moreButtons: [
          {
            key: 'dataSource-test-connection',
            text: t('common.testDatabaseConnectButton.testDatabaseConnection'),
            onClick: (record) =>
              onTestConnection(record?.uid ?? '', record?.name ?? '')
          }
        ]
      }
    : {
        buttons: [
          {
            key: 'dataSource-test-connection',
            text: t('common.testDatabaseConnectButton.testDatabaseConnection'),
            buttonProps: (record) => ({
              onClick: onTestConnection.bind(
                null,
                record?.uid ?? '',
                record?.name ?? ''
              )
            })
          }
        ]
      };
};
