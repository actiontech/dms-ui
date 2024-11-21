import { IListDBRole } from '@actiontech/shared/lib/api/provision/service/common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../locale';
import { Typography } from 'antd';
import { IDatabaseRoleTableParams } from './index.type';
import DataPermissionsTagsCell from './DataPermissionsTagsCell';

export const DatabaseRoleTableColumns = (): ActiontechTableColumn<
  IListDBRole,
  IDatabaseRoleTableParams
> => {
  return [
    {
      title: t('databaseRole.tableColumns.role'),
      dataIndex: 'db_role',
      render(role) {
        if (!role || !role.name) {
          return '-';
        }
        return <Typography.Link>{role?.name}</Typography.Link>;
      }
    },
    {
      title: t('databaseRole.tableColumns.permissions'),
      dataIndex: 'data_permissions',
      width: '80%',
      render(permissions) {
        return <DataPermissionsTagsCell dataPermissions={permissions ?? []} />;
      }
    }
  ];
};
