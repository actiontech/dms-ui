import {
  IListUserGroup,
  IUidWithName
} from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { ListUserGroupStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { t } from '../../../locale';
import generateTag from '../Common/generateTag';
import UserDesc from './UserDesc';
import { IconMemberIsAdmin, IconMemberNotAdmin } from '../../../icon/member';
import { UserStatusStyledWrapper } from '../style';
import { Space } from 'antd';

export const userGroupListColumns: ActiontechTableColumn<IListUserGroup> = [
  {
    dataIndex: 'name',
    title: () => t('dmsUserCenter.user.userGroupForm.name')
  },
  {
    dataIndex: 'desc',
    title: () => t('dmsUserCenter.user.userGroupForm.desc'),
    className: 'user-center-table-desc-column',
    render: (text) => {
      return text ? <UserDesc desc={text} /> : '-';
    },
    width: 400
  },
  {
    dataIndex: 'stat',
    title: () => t('common.status'),
    render: (status: ListUserGroupStatEnum) => {
      return (
        <UserStatusStyledWrapper>
          {status === ListUserGroupStatEnum.被禁用 ? (
            <IconMemberNotAdmin />
          ) : (
            <IconMemberIsAdmin />
          )}
          {status}
        </UserStatusStyledWrapper>
      );
    },
    width: 120
  },
  {
    dataIndex: 'users',
    title: () => t('dmsUserCenter.user.userGroupForm.bindUsers'),
    render: (users: IUidWithName) => {
      if (!Array.isArray(users)) {
        return '-';
      }
      return <Space wrap>{generateTag(users)}</Space>;
    },
    width: 400
  }
];

export const userGroupListActions = (
  onEditUserGroup: (record?: IListUserGroup) => void,
  onDeleteUserGroup: (record?: IListUserGroup) => void
): ActiontechTableActionMeta<IListUserGroup>[] => {
  return [
    {
      text: t('common.manage'),
      key: 'userGroupManage',
      buttonProps: (record) => {
        return {
          onClick: () => {
            onEditUserGroup(record);
          }
        };
      }
    },
    {
      text: t('common.delete'),
      buttonProps: () => ({
        danger: true
      }),
      key: 'userGroupDelete',
      confirm: (record) => {
        return {
          title: t('dmsUserCenter.user.deleteUserGroup.confirm', {
            name: record?.name ?? ''
          }),
          onConfirm: () => {
            onDeleteUserGroup(record);
          }
        };
      },
      permissions: (record) => {
        return record?.name !== 'admin';
      }
    }
  ];
};
