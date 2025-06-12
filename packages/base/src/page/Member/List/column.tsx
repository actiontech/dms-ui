import { Typography, Space } from 'antd';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../locale';
import {
  IListMemberV2,
  IProjectOpPermission,
  IListMemberGroup
} from '@actiontech/shared/lib/api/base/service/common';
import ProjectManagePermissions from '../components/ProjectManagePermissions';
import { BasicToolTip } from '@actiontech/shared';
import ProjectTagList from '../../../components/ProjectTagList';
import SystemRoleTagList from '../../../components/SystemRoleTagList';
import ProjectPermissions from '../components/ProjectPermissions';

const commonRoleOperateRangesRender = (
  permissions: IProjectOpPermission[],
  record: IListMemberV2 | IListMemberGroup
) => {
  if (
    (!Array.isArray(permissions) || permissions.length === 0) &&
    !record.is_project_admin
  ) {
    return '-';
  }

  if (
    (!Array.isArray(permissions) || permissions.length === 0) &&
    record.is_project_admin
  ) {
    return 'ALL';
  }

  return <ProjectPermissions permissions={permissions} />;
};

export const MemberListColumns: ActiontechTableColumn<IListMemberV2> = [
  {
    dataIndex: 'user',
    title: t('common.username'),
    width: '10%',
    render: (user) => {
      return user?.name ?? '-';
    }
  },
  {
    dataIndex: 'platform_roles',
    title: () => t('dmsMember.memberList.columns.platformRoles'),
    width: '10%',
    render: (list) => {
      return <SystemRoleTagList roles={list} />;
    }
  },
  {
    dataIndex: 'projects',
    title: () => t('dmsMember.memberList.columns.projects'),
    width: '35%',
    render: (list) => {
      return <ProjectTagList projectList={list} highlightCurrentProject />;
    }
  },
  {
    dataIndex: 'current_project_op_permissions',
    className: 'ellipsis-column-width',
    width: '30%',
    title: () => {
      return (
        <BasicToolTip
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
        </BasicToolTip>
      );
    },
    render: (permissions = [], record: IListMemberV2) => {
      return commonRoleOperateRangesRender(permissions, record);
    }
  },
  {
    dataIndex: 'is_project_admin',
    title: t('dmsMember.memberList.columns.projectManagePermissions'),
    width: '20%',
    render: (isAdmin, record) => {
      if (typeof isAdmin !== 'boolean') {
        return t('common.unknownStatus');
      }
      return (
        <ProjectManagePermissions
          isProjectAdmin={isAdmin}
          managePermissions={record.current_project_manage_permissions}
        />
      );
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
    render(users) {
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
    dataIndex: 'current_project_op_permissions',
    className: 'ellipsis-column-width',
    title: () => {
      return (
        <BasicToolTip
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
        </BasicToolTip>
      );
    },
    render: (permissions = [], record: IListMemberGroup) => {
      return commonRoleOperateRangesRender(permissions, record);
    }
  },
  {
    dataIndex: 'is_project_admin',
    title: t('dmsMember.memberList.columns.projectManagePermissions'),
    render: (isAdmin, record) => {
      if (typeof isAdmin !== 'boolean') {
        return t('common.unknownStatus');
      }
      return (
        <ProjectManagePermissions
          isProjectAdmin={isAdmin}
          managePermissions={record.current_project_manage_permissions}
        />
      );
    }
  }
];
