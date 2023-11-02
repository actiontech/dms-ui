import { IListService } from '@actiontech/shared/lib/api/provision/service/common';
import { Button, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { ModalName } from '~/data/enum';
import { t } from '~/locale';
import { TableColumn } from '~/types/common.type';
import { formatTime } from '~/utils/Common';

export const dataObjectListTableColumns = (
  openModal: (modalName: ModalName, record?: IListService) => void
): TableColumn<IListService, 'operator' | 'account'> => {
  return [
    {
      dataIndex: 'address',
      title: t('dataObject.dataSource.address')
    },
    {
      dataIndex: 'name',
      title: t('dataObject.dataSource.name')
    },
    {
      dataIndex: 'business',
      title: t('dataObject.dataSource.business')
    },
    {
      dataIndex: 'db_type',
      title: t('dataObject.dataSource.type')
    },
    {
      dataIndex: 'user',
      title: t('dataObject.dataSource.user')
    },
    {
      dataIndex: 'account',
      title: t('dataObject.dataSource.account'),
      width: 120,
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              openModal(ModalName.ViewAccount, record);
            }}
          >
            {t('dataObject.view_account')}
          </Button>
        );
      }
    },
    {
      dataIndex: 'last_sync_data_time',
      title: () => t('dataObject.dataSource.last_sync_data_time'),
      render(text) {
        if (moment(text).unix() < 0) return '--';
        return formatTime(text);
      }
    },
    {
      dataIndex: 'last_sync_data_result',
      width: 250,
      ellipsis: true,
      title: () => t('dataObject.dataSource.last_sync_data_result'),
      render: (val) => {
        if (!val) {
          return (
            <Typography.Text type="success">
              {t('externalDataSource.columns.normalStatus')}
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
