import { IListUser } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { ListUserStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { orderBy } from 'lodash';
import { t } from '../../../../locale';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { OpPermissionTypeUid, SystemRole } from '@actiontech/shared/lib/enum';
import { CheckHexagonOutlined, CloseHexagonOutlined } from '@actiontech/icons';

export const UserListColumns: () => ActiontechTableColumn<IListUser> = () => [
  {
    dataIndex: 'name',
    title: () => t('common.username')
  },
  {
    dataIndex: 'email',
    title: () => t('dmsUserCenter.user.userForm.email'),
    render: (text) => {
      return text || '-';
    }
  },
  {
    dataIndex: 'phone',
    title: () => t('dmsUserCenter.user.userForm.phone'),
    render: (text) => {
      return text || '-';
    }
  },
  {
    dataIndex: 'stat',
    title: () => t('dmsUserCenter.user.userList.columns.status'),
    render: (status) => {
      return (
        <TableColumnWithIconStyleWrapper>
          {status === ListUserStatEnum.被禁用 ? (
            <CloseHexagonOutlined />
          ) : (
            <CheckHexagonOutlined />
          )}
          <span>{status}</span>
        </TableColumnWithIconStyleWrapper>
      );
    }
  },
  {
    dataIndex: 'authentication_type',
    title: () => t('dmsUserCenter.user.userList.columns.authenticationType')
  },
  {
    dataIndex: 'op_permissions',
    title: () => t('dmsUserCenter.user.userForm.opPermissions'),
    render: (list) => {
      if (!Array.isArray(list)) {
        return '-';
      }
      return orderBy(list, ['uid'], ['asc'])
        .map((e) => e.name)
        .join(',');
    }
  }
];

export const UserListActions = (
  onEditUser: (record?: IListUser) => void,
  onDeleteUser: (record?: IListUser) => void,
  role: SystemRole | ''
): ActiontechTableActionMeta<IListUser>[] => {
  const calculateActionDisabled = (record?: IListUser) => {
    if (
      record?.op_permissions?.some(
        (v) => v.uid === OpPermissionTypeUid.global_management
      ) ||
      record?.name === SystemRole.admin
    ) {
      return role !== SystemRole.admin;
    }
    return false;
  };
  return [
    {
      text: t('common.manage'),
      key: 'userManage',
      buttonProps: (record) => {
        return {
          onClick: () => {
            onEditUser(record);
          },
          disabled: calculateActionDisabled(record)
        };
      }
    },
    {
      text: t('common.delete'),
      buttonProps: (record) => ({
        danger: true,
        disabled: calculateActionDisabled(record)
      }),
      key: 'userDelete',
      confirm: (record) => {
        return {
          title: t('dmsUserCenter.user.deleteUser.confirmTitle', {
            username: record?.name ?? ''
          }),
          onConfirm: () => {
            onDeleteUser(record);
          }
        };
      },
      permissions: (record) => {
        return record?.name !== SystemRole.admin;
      }
    }
  ];
};
