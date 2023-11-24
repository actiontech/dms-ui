import { IDataPermissionsTable } from './Modal/AddDataPermission/index.d';
import {
  ActiontechTableActionMeta,
  ActiontechTableColumn
} from '@actiontech/shared/lib/components/ActiontechTable';
import { Space } from 'antd';
import { BasicTag } from '@actiontech/shared';
import { t } from '../../../locale';

export const AuthTableColumns =
  (): ActiontechTableColumn<IDataPermissionsTable> => {
    return [
      {
        title: () => <>{t('auth.addAuth.baseForm.baseFormTable.service')}</>,
        dataIndex: 'serviceLabel',
        fixed: true
      },
      {
        title: () => <>{t('auth.addAuth.baseForm.baseFormTable.objects')}</>,
        dataIndex: 'objectsLabel',
        render: (objects: IDataPermissionsTable['objectsLabel']) => {
          return (
            <Space size={0}>
              {objects.map((item) => {
                return <BasicTag key={item}>{item}</BasicTag>;
              })}
            </Space>
          );
        }
      },
      {
        title: () => <>{t('auth.addAuth.baseForm.baseFormTable.operation')}</>,
        dataIndex: 'operationsLabel',
        render: (operations: IDataPermissionsTable['operationsLabel']) => {
          return (
            <Space size={0}>
              {operations.map((item) => {
                return <BasicTag key={item}>{item}</BasicTag>;
              })}
            </Space>
          );
        }
      }
    ];
  };

export const AuthTableActions = (
  onEditAuth: (index: number) => void,
  onRemoveAuth: (index: number) => IDataPermissionsTable
): ActiontechTableActionMeta<IDataPermissionsTable>[] => {
  return [
    {
      key: 'edit',
      text: t('common.edit'),
      buttonProps: (record) => {
        return {
          onClick: onEditAuth.bind(null, record?.index ?? 0)
        };
      }
    },
    {
      key: 'delete',
      text: t('common.delete'),
      buttonProps: () => {
        return {
          danger: true
        };
      },
      confirm: (record) => ({
        title: t('auth.editTemplate.removeConfirmTips'),
        onConfirm: onRemoveAuth.bind(null, record?.index ?? 0)
      })
    }
  ];
};
