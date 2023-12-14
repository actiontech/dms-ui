import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../../locale';
import { IScopeReply, IViewRoleReply } from '../../../../api/common';
import { BasicTag } from '@actiontech/shared';
import EllipsisModal from './components/EllipsisModal';
import { Space } from 'antd';
import { AdminRole } from '../../../../data/enum';

export const RoleListColumns: ActiontechTableColumn<IViewRoleReply> = [
  {
    dataIndex: 'role_name',
    title: () => t('userManagement.roleName')
  },
  {
    dataIndex: 'role_desc',
    title: () => t('userManagement.desc')
  },
  {
    dataIndex: 'scopes',
    width: 450,
    title: () => t('userManagement.role.operationPermission'),
    render: (scope: IScopeReply[]) => {
      return (
        <Space wrap>
          {scope.slice(0, 3).map((item) => (
            <BasicTag key={item.scope_name}>{item.scope_desc}</BasicTag>
          ))}
          {scope.length > 3 ? <EllipsisModal data={scope} /> : null}
        </Space>
      );
    }
  }
];

export const RoleListActions = (
  onEditRole: (record?: IViewRoleReply) => void,
  onDeleteRole: (record?: IViewRoleReply) => void
): ActiontechTableActionMeta<IViewRoleReply>[] => {
  return [
    {
      text: t('common.edit'),
      key: 'editRole',
      buttonProps: (record) => {
        return {
          onClick: () => {
            onEditRole(record);
          }
        };
      },
      permissions: (record) => record?.role_name !== AdminRole.admin
    },
    {
      text: t('common.delete'),
      buttonProps: () => ({
        danger: true
      }),
      key: 'removeRole',
      confirm: (record) => {
        return {
          title: t('userManagement.role.deleteRole.confirmTitle', {
            name: record?.role_name ?? ''
          }),
          onConfirm: () => {
            onDeleteRole(record);
          }
        };
      },
      permissions: (record) => record?.role_name !== AdminRole.admin
    }
  ];
};
