import { Typography, Space } from 'antd';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../locale';
import {
  IListMember,
  IListMemberRoleWithOpRange,
  IListMemberGroup
} from '@actiontech/shared/lib/api/base/service/common';
import renderRolesInfo from '../Common/renderRolesInfo';
import IsProjectAdmin from '../components/IsProjectAdmin';
import { BasicToolTip } from '@actiontech/shared';
import { MemberPermissionStyleWrapper } from '../style';
import ProjectTagList from '../../../components/ProjectTagList';
import SystemRoleTagList from '../../../components/SystemRoleTagList';

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
    <MemberPermissionStyleWrapper
      titleWidth={500}
      title={renderRolesInfo(roles, false)}
    >
      {renderRolesInfo(roles, true)}
    </MemberPermissionStyleWrapper>
  );
};

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
    width: '35%',
    render: (list) => {
      return <ProjectTagList projectList={list} />;
    }
  },
  {
    dataIndex: 'role_with_op_ranges',
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
    render: (roles = [], record: IListMember) => {
      return commonRoleOperateRangesRender(roles, record);
    }
  },
  {
    dataIndex: 'is_project_admin',
    title: t('dmsMember.memberList.columns.isProjectAdmin'),
    width: '20%',
    render: (isAdmin) => {
      if (typeof isAdmin !== 'boolean') {
        return t('common.unknownStatus');
      }
      return <IsProjectAdmin value={isAdmin} />;
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
    dataIndex: 'role_with_op_ranges',
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
    render: (roles = [], record: IListMemberGroup) => {
      return commonRoleOperateRangesRender(roles, record);
    }
  },
  {
    dataIndex: 'is_project_admin',
    title: t('dmsMember.memberList.columns.isProjectAdmin'),
    render: (isAdmin) => {
      if (typeof isAdmin !== 'boolean') {
        return t('common.unknownStatus');
      }
      return <IsProjectAdmin value={isAdmin} />;
    }
  }
];
