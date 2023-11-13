import { Typography, Space } from 'antd';
import {
  ActiontechTableColumn,
  ActiontechTableActionMeta
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../locale';
import {
  IListMember,
  IListMemberRoleWithOpRange,
  IUidWithName,
  IListMemberGroup
} from '@actiontech/shared/lib/api/base/service/common';
import renderRolesInfo from './Common/renderRolesInfo';
import IsAdmin from './components/IsAdmin';
import { BasicToolTips } from '@actiontech/shared';

const commonRoleOperateRangesRender = (
  roles: IListMemberRoleWithOpRange[],
  record: IListMember | IListMemberGroup
) => {
  if (
    (!Array.isArray(roles) || roles.length === 0) &&
    !record.is_project_admin
  ) {
    return '-';
  }

  if (
    (!Array.isArray(roles) || roles.length === 0) &&
    record.is_project_admin
  ) {
    return 'ALL';
  }

  return (
    <BasicToolTips title={renderRolesInfo(roles, false)}>
      {renderRolesInfo(roles, true)}
    </BasicToolTips>
  );
};

export const MemberListColumns: ActiontechTableColumn<IListMember> = [
  {
    dataIndex: 'user',
    title: t('common.username'),
    render: (user: IUidWithName) => {
      return user?.name ?? '-';
    }
  },
  {
    dataIndex: 'role_with_op_ranges',
    title: () => {
      return (
        <BasicToolTips
          suffixIcon
          titleWidth={280}
          title={
            <Space direction="vertical">
              {t('dmsMember.memberList.columns.opRangeTips')}
              {t('dmsMember.memberList.allPermission')}
            </Space>
          }
        >
          {t('dmsMember.memberList.columns.opRanges')}
        </BasicToolTips>
      );
    },
    render: (roles: IListMemberRoleWithOpRange[], record: IListMember) => {
      return commonRoleOperateRangesRender(roles, record);
    }
  },
  {
    dataIndex: 'is_project_admin',
    title: t('dmsMember.memberList.columns.isProjectAdmin'),
    render: (isAdmin: boolean) => {
      if (typeof isAdmin !== 'boolean') {
        return t('common.unknownStatus');
      }
      return <IsAdmin value={isAdmin} />;
    }
  }
];

export const MemberListActions = (
  onEditMember: (record: IListMember | undefined) => void,
  onDeleteMember: (record: IListMember | undefined) => void
): ActiontechTableActionMeta<IListMember>[] => [
  {
    text: t('common.edit'),
    key: 'memberEdit',
    buttonProps: (record) => {
      return {
        onClick: () => {
          onEditMember(record);
        }
      };
    }
  },
  {
    text: t('common.delete'),
    buttonProps: () => ({
      danger: true
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
    permissions: (record) => {
      return record?.user?.name !== 'admin';
    }
  }
];

export const MemberGroupListColumns: ActiontechTableColumn<IListMemberGroup> = [
  {
    dataIndex: 'name',
    title: t('dmsMember.memberGroupList.columns.userGroupName')
  },
  {
    dataIndex: 'users',
    title: t('dmsMember.memberGroupList.columns.users'),
    render(users: IUidWithName[]) {
      if (!Array.isArray(users)) {
        return null;
      }
      return (
        <Typography.Text ellipsis={true}>
          {users.map((v) => v.name).join('、')}
        </Typography.Text>
      );
    }
  },
  {
    dataIndex: 'role_with_op_ranges',
    title: () => {
      return (
        <BasicToolTips
          suffixIcon
          titleWidth={280}
          title={
            <Space direction="vertical">
              {t('dmsMember.memberGroupList.columns.opRangeTips')}
              {t('dmsMember.memberGroupList.allPermission')}
            </Space>
          }
        >
          {t('dmsMember.memberGroupList.columns.opRanges')}
        </BasicToolTips>
      );
    },
    render: (roles: IListMemberRoleWithOpRange[], record: IListMemberGroup) => {
      return commonRoleOperateRangesRender(roles, record);
    }
  },
  {
    dataIndex: 'is_project_admin',
    title: t('dmsMember.memberList.columns.isProjectAdmin'),
    render: (isAdmin: boolean) => {
      if (typeof isAdmin !== 'boolean') {
        return t('common.unknownStatus');
      }
      return <IsAdmin value={isAdmin} />;
    }
  }
];

export const MemberGroupListActions = (
  onEditMemberGroup: (record?: IListMemberGroup) => void,
  onDeleteMemberGroup: (record?: IListMemberGroup) => void
): ActiontechTableActionMeta<IListMemberGroup>[] => [
  {
    text: t('common.edit'),
    key: 'memberGroupEdit',
    buttonProps: (record) => {
      return {
        onClick: () => {
          onEditMemberGroup(record);
        }
      };
    }
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
    }
  }
];
