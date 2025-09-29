import { t } from '../../../locale';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
import {
  IListMember,
  IListMemberGroup
} from '@actiontech/shared/lib/api/base/service/common';
import { SystemRole } from '@actiontech/dms-kit';

export const MemberListActions = (
  onEditMember: (record: IListMember | undefined) => void,
  onDeleteMember: (record: IListMember | undefined) => void,
  onManageMemberGroup: (record: IListMember | undefined) => void
): ActiontechTableActionsWithPermissions<IListMember> => [
  {
    text: t('common.edit'),
    key: 'memberEdit',
    buttonProps: (record) => {
      return {
        onClick: () => {
          onEditMember(record);
        }
      };
    },
    permissions: PERMISSIONS.ACTIONS.BASE.MEMBER.EDIT_MEMBER
  },
  {
    text: t('dmsMember.memberList.actions.manageMemberGroup'),
    buttonProps: (record) => ({
      hidden: !record?.is_group_member,
      onClick: () => {
        onManageMemberGroup(record);
      }
    }),
    key: 'manageUserGroup',
    permissions: PERMISSIONS.ACTIONS.BASE.MEMBER.MANAGE_MEMBER_GROUP
  },
  {
    text: t('dmsMember.memberList.actions.removeMember'),
    buttonProps: (record) => ({
      danger: true,
      hidden: record?.user?.name === SystemRole.admin
    }),
    key: 'memberDelete',
    confirm: (record) => {
      return {
        title: t('dmsMember.memberList.deleteConfirmTitle', {
          name: record?.user?.name ?? ''
        }),
        onConfirm: () => {
          onDeleteMember(record);
        }
      };
    },
    permissions: PERMISSIONS.ACTIONS.BASE.MEMBER.DELETE_MEMBER
  }
];

export const MemberGroupListActions = (
  onEditMemberGroup: (record?: IListMemberGroup) => void,
  onDeleteMemberGroup: (record?: IListMemberGroup) => void
): ActiontechTableActionsWithPermissions<IListMemberGroup> => [
  {
    text: t('common.edit'),
    key: 'memberGroupEdit',
    buttonProps: (record) => {
      return {
        onClick: () => {
          onEditMemberGroup(record);
        }
      };
    },
    permissions: PERMISSIONS.ACTIONS.BASE.MEMBER.EDIT_MEMBER_GROUP
  },
  {
    text: t('common.delete'),
    buttonProps: () => ({
      danger: true
    }),
    key: 'memberGroupDelete',
    confirm: (record) => {
      return {
        title: t('dmsMember.memberGroupList.deleteConfirmTitle', {
          name: record?.name ?? ''
        }),
        onConfirm: () => {
          onDeleteMemberGroup(record);
        }
      };
    },
    permissions: PERMISSIONS.ACTIONS.BASE.MEMBER.DELETE_MEMBER_GROUP
  }
];
