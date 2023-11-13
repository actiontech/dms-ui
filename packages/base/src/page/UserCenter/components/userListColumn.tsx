import {
  IListUser,
  IUidWithName
} from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { ListUserStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { orderBy } from 'lodash';
import { t } from '../../../locale';
import generateTag from '../Common/generateTag';
import { IconMemberIsAdmin, IconMemberNotAdmin } from '../../../icon/member';
import { UserStatusStyledWrapper } from '../style';
import { Space } from 'antd';

export const UserListColumns: ActiontechTableColumn<IListUser> = [
  {
    dataIndex: 'name',
    title: () => t('common.username')
  },
  {
    dataIndex: 'email',
    title: () => t('dmsUserCenter.user.userForm.email'),
    render: (text: string) => {
      return text || '-';
    }
  },
  {
    dataIndex: 'phone',
    title: () => t('dmsUserCenter.user.userForm.phone'),
    render: (text: string) => {
      return text || '-';
    }
  },
  {
    dataIndex: 'stat',
    title: () => t('dmsUserCenter.user.userList.columns.status'),
    render: (status: ListUserStatEnum) => {
      return (
        <UserStatusStyledWrapper>
          {status === ListUserStatEnum.被禁用 ? (
            <IconMemberNotAdmin />
          ) : (
            <IconMemberIsAdmin />
          )}
          {status}
        </UserStatusStyledWrapper>
      );
    }
  },
  {
    dataIndex: 'authentication_type',
    title: () => t('dmsUserCenter.user.userList.columns.authenticationType')
  },
  {
    dataIndex: 'user_groups',
    title: () => t('dmsUserCenter.user.userForm.userGroups'),
    render: (userGroupList?: IUidWithName[]) => {
      if (!Array.isArray(userGroupList)) {
        return '-';
      }
      return <Space wrap>{generateTag(userGroupList)}</Space>;
    }
  },
  {
    dataIndex: 'op_permissions',
    title: () => t('dmsUserCenter.user.userForm.opPermissions'),
    render: (list: IUidWithName[]) => {
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
  onDeleteUser: (record?: IListUser) => void
): ActiontechTableActionMeta<IListUser>[] => {
  return [
    {
      text: t('common.manage'),
      key: 'userManage',
      buttonProps: (record) => {
        return {
          onClick: () => {
            onEditUser(record);
          }
        };
      }
    },
    {
      text: t('common.delete'),
      buttonProps: () => ({
        danger: true
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
        return record?.name !== 'admin';
      }
    }
  ];
};
