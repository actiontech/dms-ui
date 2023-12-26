import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../../locale';
import { IScopeReply, IViewRoleReply } from '../../../../api/common';
import { BasicTag } from '@actiontech/shared';
import { Space } from 'antd';
import { AdminRole } from '../../../../data/enum';
import { EllipsisOutlined } from '@ant-design/icons';
import { CheckPermissionEllipsisStyleWrapper } from './style';

export const RoleListColumns = (
  onCheckRolePermission: (id?: string) => void
): ActiontechTableColumn<IViewRoleReply> => [
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
    render: (scope: IScopeReply[], record: IViewRoleReply) => {
      return (
        <Space wrap>
          {scope.slice(0, 3).map((item) => (
            <BasicTag key={item.scope_name}>{item.scope_desc}</BasicTag>
          ))}
          {scope.length > 3 ? (
            <CheckPermissionEllipsisStyleWrapper
              onClick={() => onCheckRolePermission(record?.id)}
            >
              <EllipsisOutlined />
            </CheckPermissionEllipsisStyleWrapper>
          ) : null}
        </Space>
      );
    }
  }
];

export const RoleListActions = (
  onEditRole: (record?: IViewRoleReply) => void,
  onDeleteRole: (record?: IViewRoleReply) => void,
  hasEditPermission: boolean,
  hasDeletePermission: boolean
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
      permissions: (record) =>
        record?.role_name !== AdminRole.admin && hasEditPermission
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
      permissions: (record) =>
        record?.role_name !== AdminRole.admin && hasDeletePermission
    }
  ];
};
