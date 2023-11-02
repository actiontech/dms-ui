import { IDataPermissionsTable } from './Modal/AddDataPermission/index.d';
import { TableColumn } from '~/components/ProvisionTable';
import { Button, Tag } from 'antd';
import i18n from 'i18next';

export const authTableColumns = (
  handleEditAuth: (index: number) => void,
  handleRemoveAuth: (index: number) => IDataPermissionsTable
): TableColumn<IDataPermissionsTable, 'operator'> => {
  return [
    {
      title: () => <>{i18n.t('auth.addAuth.baseForm.baseFormTable.service')}</>,
      dataIndex: 'serviceLabel',
      fixed: true
    },
    {
      title: () => <>{i18n.t('auth.addAuth.baseForm.baseFormTable.objects')}</>,
      dataIndex: 'objectsLabel',
      render: (objects: IDataPermissionsTable['objectsLabel']) => {
        return objects.map((item) => {
          return <Tag key={item}>{item}</Tag>;
        });
      }
    },
    {
      title: () => (
        <>{i18n.t('auth.addAuth.baseForm.baseFormTable.operation')}</>
      ),
      dataIndex: 'operationsLabel',
      render: (operations: IDataPermissionsTable['operationsLabel']) => {
        return operations.map((item) => {
          return <Tag key={item}>{item}</Tag>;
        });
      }
    },
    {
      title: () => <>{i18n.t('common.operate')}</>,
      dataIndex: 'operator',
      fixed: 'right',
      width: 160,
      render: (value, record, index: number) => {
        return (
          <>
            <Button type="link" onClick={handleEditAuth.bind(null, index)}>
              <>{i18n.t('common.edit')}</>
            </Button>
            <Button
              type="text"
              onClick={handleRemoveAuth.bind(null, index)}
              danger
            >
              <>{i18n.t('common.delete')}</>
            </Button>
          </>
        );
      }
    }
  ];
};
