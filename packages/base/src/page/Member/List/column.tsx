import { Typography, Space, Popover } from 'antd';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../locale';
import {
  IListMember,
  IListMemberGroup
} from '@actiontech/shared/lib/api/base/service/common';
import ProjectManagePermissions from '../components/ProjectManagePermissions';
import { BasicToolTip } from '@actiontech/dms-kit';
import ProjectTagList from '../../../components/ProjectTagList';
import SystemRoleTagList from '../../../components/SystemRoleTagList';
import ProjectOpPermissions from '../components/ProjectOpPermissions';
export const MemberListColumns: ActiontechTableColumn<IListMember> = [
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
    width: '20%',
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
    render: (permissions = [], record: IListMember) => {
      if (
        (!Array.isArray(permissions) || permissions.length === 0) &&
        !record.is_project_admin &&
        !record.current_project_admin?.is_admin
      ) {
        return '-';
      }
      if (record.is_project_admin || !!record.current_project_admin?.is_admin) {
        return (
          <Popover
            content={
              !!record.current_project_admin?.is_admin &&
              !!record.current_project_admin?.member_groups?.length
                ? t('dmsMember.memberList.columns.sourceFromMemberGroup', {
                    groupName:
                      record.current_project_admin?.member_groups?.join(',')
                  })
                : t('dmsMember.memberList.columns.sourceFromDorectPermission')
            }
            title={null}
            placement="top"
            overlayStyle={{
              maxWidth: 450
            }}
          >
            ALL
          </Popover>
        );
      }
      return <ProjectOpPermissions permissions={permissions} />;
    }
  },
  {
    dataIndex: 'is_project_admin',
    title: t('dmsMember.memberList.columns.projectManagePermissions'),
    width: '20%',
    render: (isAdmin, record) => {
      return (
        <ProjectManagePermissions
          isProjectAdmin={!!isAdmin}
          currentProjectAdmin={record.current_project_admin}
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
    width: '30%',
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
      if (
        (!Array.isArray(permissions) || permissions.length === 0) &&
        !record.is_project_admin
      ) {
        return '-';
      }
      if (record.is_project_admin) {
        return 'ALL';
      }
      return <ProjectOpPermissions permissions={permissions} />;
    }
  },
  {
    dataIndex: 'is_project_admin',
    title: t('dmsMember.memberList.columns.projectManagePermissions'),
    width: '30%',
    render: (isAdmin, record) => {
      return (
        <ProjectManagePermissions
          isProjectAdmin={!!isAdmin}
          managePermissions={record.current_project_manage_permissions}
          isGroup
        />
      );
    }
  }
];
