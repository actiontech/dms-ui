import {
  IProjectOpPermission,
  IProjectRole
} from '@actiontech/shared/lib/api/base/service/common';
import { Space, Typography, Popover } from 'antd';
import { BasicTag } from '@actiontech/dms-kit';
import { t } from '../../../locale';
import React from 'react';
type ProjectOpPermissionsProps = {
  permissions: IProjectOpPermission[];
};
const ProjectOpPermissions: React.FC<ProjectOpPermissionsProps> = ({
  permissions
}) => {
  const renderRoleTag = (
    role: IProjectRole,
    dataSource: string,
    index: number
  ) => {
    const roleName = role?.name || '';
    const isFromMemberGroup = !!role.member_group;
    const popoverContent = (
      <Space direction="vertical">
        <div>
          {isFromMemberGroup
            ? t('dmsMember.memberList.columns.sourceFromMemberGroup', {
                groupName: role.member_group?.name
              })
            : t('dmsMember.memberList.columns.sourceFromDorectPermission')}
        </div>
        <div>
          {t('dmsMember.memberList.columns.permissions')}：
          {role.op_permissions?.map((item) => item.name).join(',')}
        </div>
      </Space>
    );
    return (
      <Popover
        content={popoverContent}
        title={null}
        placement="top"
        key={`${role.uid}-${dataSource}-${index}`}
        overlayStyle={{
          maxWidth: 450
        }}
      >
        <BasicTag
          style={{
            height: 28
          }}
          size="small"
        >
          {roleName}
        </BasicTag>
      </Popover>
    );
  };
  return (
    <Space direction="vertical" size={8}>
      {permissions.map((permission, index) => {
        const dataSource = permission?.data_source ?? '';
        const roles = permission?.roles ?? [];
        return (
          <Space key={`${dataSource}${index}`} direction="vertical">
            <Typography.Text>{dataSource}:</Typography.Text>
            <Space wrap size={[4, 4]}>
              {roles.map((role, i) => renderRoleTag(role, dataSource, i))}
            </Space>
          </Space>
        );
      })}
    </Space>
  );
};
export default ProjectOpPermissions;
