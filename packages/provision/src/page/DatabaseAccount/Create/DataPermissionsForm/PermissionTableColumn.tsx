import {
  ActiontechTableActionMeta,
  ActiontechTableColumn
} from '@actiontech/shared/lib/components/ActiontechTable';
import { Space } from 'antd';
import { BasicTag } from '@actiontech/shared';
import { t } from '../../../../locale';
import { PermissionsType } from '../../index.type';

export const PermissionTableColumn =
  (): ActiontechTableColumn<PermissionsType> => {
    return [
      {
        title: () => <>{t('databaseAccount.create.form.objects')}</>,
        dataIndex: 'objectsLabel',
        render: (objects: PermissionsType['objectsLabel']) => {
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
        title: () => <>{t('databaseAccount.create.form.operation')}</>,
        dataIndex: 'operationsLabel',
        render: (operations: PermissionsType['operationsLabel']) => {
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

export const PermissionTableActions = (
  onEdit: (id: string) => void,
  onRemove: (id: string) => void
): ActiontechTableActionMeta<PermissionsType>[] => {
  return [
    {
      key: 'edit',
      text: t('common.edit'),
      buttonProps: (record) => {
        return {
          onClick: onEdit.bind(null, record?.id ?? '')
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
        title: t('databaseAccount.create.form.removeConfirmTips'),
        onConfirm: onRemove.bind(null, record?.id ?? '')
      })
    }
  ];
};
