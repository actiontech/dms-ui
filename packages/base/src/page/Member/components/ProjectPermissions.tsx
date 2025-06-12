import {
  IProjectOpPermission,
  IProjectRole
} from '@actiontech/shared/lib/api/base/service/common';
import { Space, Typography, Popover } from 'antd';
import { BasicTag } from '@actiontech/shared';
import { t } from '../../../locale';
import React from 'react';

type OperationPermissionsProps = {
  permissions: IProjectOpPermission[];
};

const ProjectPermissions: React.FC<OperationPermissionsProps> = ({
  permissions
}) => {
  const renderRoleTag = (role: IProjectRole, dataSource: string) => {
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
        key={`${role.uid}-${dataSource}`}
        overlayStyle={{ maxWidth: 450 }}
      >
        <BasicTag>{roleName}</BasicTag>
      </Popover>
    );
  };

  return (
    <Space direction="vertical" size={8}>
      {permissions.map((permission, index) => {
        const dataSource = permission?.data_source ?? '';
        const roles = permission?.roles ?? [];

        return (
          <Space key={`${dataSource}${index}`}>
            <Typography.Text>{dataSource}:</Typography.Text>
            <Space wrap size={[4, 4]}>
              {roles.map((role) => renderRoleTag(role, dataSource))}
            </Space>
          </Space>
        );
      })}
    </Space>
  );
};

export default ProjectPermissions;
