import { Tag } from 'antd';
import { t } from '~/locale';
import { TableColumn } from '~/components/ProvisionTable';
import { IUserInfo } from '@actiontech/shared/lib/api/provision/service/common';

export const accountTableColumns: TableColumn<IUserInfo> = [
  {
    title: t('common.username'),
    dataIndex: 'user',
    fixed: true
  },
  {
    title: t('dataObject.viewAccount.columns.host'),
    dataIndex: 'host'
  },
  {
    title: t('dataObject.viewAccount.columns.privileges'),
    dataIndex: 'privileges',
    render: (privileges: IUserInfo['privileges']) => {
      return (
        privileges?.map((item, index) => {
          return <Tag key={index}>{item}</Tag>;
        }) ?? '--'
      );
    }
  }
];
