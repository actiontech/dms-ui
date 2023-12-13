import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../../locale';
import { IViewRoleReply } from '../../../../api/common';
import { BasicTag } from '@actiontech/shared';
import EllipsisModal from './components/EllipsisModal';
import { Space } from 'antd';

export const RoleListColumns: ActiontechTableColumn<IViewRoleReply> = [
  {
    dataIndex: 'role_name',
    title: () => t('userManagement.user.roleName')
  },
  {
    dataIndex: 'role_desc',
    title: () => t('userManagement.role.roleDesc')
  },
  {
    dataIndex: 'scopes',
    width: 400,
    title: () => t('userManagement.role.operationPermission'),
    render: (scope: string[]) => {
      return (
        <Space wrap>
          {scope.slice(0, 3).map((item) => (
            <BasicTag key={item}>{item}</BasicTag>
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
      }
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
      }
    }
  ];
};
