import { IDataObjectSource } from '@actiontech/shared/lib/api/provision/service/common';
import { Tooltip, Typography } from 'antd';
import i18n from 'i18next';
import { TableColumn } from '~/types/common.type';

export const externalDataSourceListTableColumns = (): TableColumn<
  IDataObjectSource,
  'account'
> => {
  return [
    {
      dataIndex: 'name',
      title: () => <>{i18n.t('externalDataSource.columns.name')}</>
    },
    {
      dataIndex: 'version',
      title: () => <>{i18n.t('externalDataSource.columns.version')}</>
    },
    {
      dataIndex: 'address',
      title: () => <>{i18n.t('externalDataSource.columns.address')}</>
    },
    {
      dataIndex: 'last_sync_error',
      width: 250,
      ellipsis: true,
      title: () => <>{i18n.t('externalDataSource.columns.last_sync')}</>,
      render: (val) => {
        if (!val) {
          return (
            <Typography.Text type="success">
              {i18n.t<string>('externalDataSource.columns.normalStatus')}
            </Typography.Text>
          );
        }
        return (
          <Tooltip placement="topLeft" title={val}>
            <Typography.Text type="danger">{val}</Typography.Text>
          </Tooltip>
        );
      }
    }
  ];
};
