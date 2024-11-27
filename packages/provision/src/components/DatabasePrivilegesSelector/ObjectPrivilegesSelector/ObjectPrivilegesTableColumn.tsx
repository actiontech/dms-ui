import {
  ActiontechTableActionMeta,
  ActiontechTableColumn
} from '@actiontech/shared/lib/components/ActiontechTable';
import { ObjectPrivilegeValues } from './index.type';
import { t } from '../../../locale';
import TableTagsCell from '../../TableTagsCell';

export const ObjectPrivilegesTableColumn =
  (): ActiontechTableColumn<ObjectPrivilegeValues> => {
    return [
      {
        title: () => <>{t('databaseAccount.create.form.objects')}</>,
        dataIndex: 'objectsLabel',
        render: (objects: ObjectPrivilegeValues['objectsLabel']) => {
          return <TableTagsCell dataSource={objects} tagLimit={3} />;
        }
      },
      {
        title: () => <>{t('databaseAccount.create.form.operation')}</>,
        dataIndex: 'operationsLabel',
        render: (operations: ObjectPrivilegeValues['operationsLabel']) => {
          return <TableTagsCell dataSource={operations} tagLimit={3} />;
        }
      }
    ];
  };

export const ObjectPrivilegesTableActions = (
  onEdit: (id: string) => void,
  onRemove: (id: string) => void
): ActiontechTableActionMeta<ObjectPrivilegeValues>[] => {
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
