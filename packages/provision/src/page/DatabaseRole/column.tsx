import { IListDBRole } from '@actiontech/shared/lib/api/provision/service/common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../locale';
import { Typography } from 'antd';
import { IDatabaseRoleTableParams } from './index.type';
import TableTagsCell from '../../components/TableTagsCell';

export const DatabaseRoleTableColumns = (
  handleClickDbRoleName: (record: IListDBRole) => void
): ActiontechTableColumn<IListDBRole, IDatabaseRoleTableParams> => {
  return [
    {
      title: t('databaseRole.tableColumns.role'),
      dataIndex: 'db_role',
      render(role, record) {
        if (!role || !role.name) {
          return '-';
        }
        return (
          <Typography.Link
            onClick={() => {
              handleClickDbRoleName(record);
            }}
          >
            {role?.name}
          </Typography.Link>
        );
      }
    },
    {
      title: t('databaseRole.tableColumns.childRoles'),
      dataIndex: 'child_roles',
      render(childRoles) {
        return (
          <TableTagsCell dataSource={childRoles?.map((v) => v.name!) ?? []} />
        );
      }
    },
    {
      title: t('databaseRole.tableColumns.permissions'),
      dataIndex: 'data_permissions',
      width: '60%',
      render(permissions) {
        return <TableTagsCell dataSource={permissions ?? []} />;
      }
    }
  ];
};
