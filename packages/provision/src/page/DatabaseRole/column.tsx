import { IListDBRole } from '@actiontech/shared/lib/api/provision/service/common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../locale';
import { Typography } from 'antd';
import { IDatabaseRoleTableParams } from './index.type';
import RoleTableTagsCell from './RoleTableTagsCell';

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
      title: t('databaseRole.tableColumns.childRoles'),
      dataIndex: 'child_roles',
      render(childRoles) {
        if (!childRoles || !childRoles.length) {
          return '-';
        }
        return (
          <RoleTableTagsCell
            dataSource={childRoles.map((v) => v.name!) ?? []}
          />
        );
      }
    },
    {
      title: t('databaseRole.tableColumns.permissions'),
      dataIndex: 'data_permissions',
      width: '60%',
      render(permissions) {
        return <RoleTableTagsCell dataSource={permissions ?? []} />;
      }
    }
  ];
};
