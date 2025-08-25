import { useTranslation } from 'react-i18next';
import { Space, Popover } from 'antd';
import {
  ICurrentProjectAdmin,
  IProjectManagePermission
} from '@actiontech/shared/lib/api/base/service/common';
import { BasicTag, EmptyBox } from '@actiontech/dms-kit';
interface ProjectManagePermissionsProps {
  isProjectAdmin: boolean;
  currentProjectAdmin?: ICurrentProjectAdmin;
  managePermissions?: IProjectManagePermission[];
  isGroup?: boolean;
}
const ProjectManagePermissions: React.FC<ProjectManagePermissionsProps> = ({
  isProjectAdmin,
  currentProjectAdmin,
  managePermissions = [],
  isGroup = false
}) => {
  const { t } = useTranslation();
  if (isProjectAdmin || !!currentProjectAdmin?.is_admin) {
    return (
      <EmptyBox if={!isGroup} defaultNode="ALL">
        <Popover
          content={
            !!currentProjectAdmin?.is_admin &&
            !!currentProjectAdmin?.member_groups?.length
              ? t('dmsMember.memberList.columns.sourceFromMemberGroup', {
                  groupName: currentProjectAdmin?.member_groups?.join(',')
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
      </EmptyBox>
    );
  }
  if (managePermissions.length > 0) {
    return (
      <Space wrap>
        {managePermissions.map((permission, index) => (
          <EmptyBox
            if={!isGroup}
            defaultNode={
              <BasicTag
                style={{
                  height: 28
                }}
                size="small"
                key={permission.uid}
              >
                {permission.name}
              </BasicTag>
            }
            key={index}
          >
            <Popover
              content={
                !!permission?.member_group
                  ? t('dmsMember.memberList.columns.sourceFromMemberGroup', {
                      groupName: permission?.member_group
                    })
                  : t('dmsMember.memberList.columns.sourceFromDorectPermission')
              }
              title={null}
              placement="top"
              overlayStyle={{
                maxWidth: 450
              }}
              key={permission.uid}
            >
              <BasicTag
                style={{
                  height: 28
                }}
                size="small"
                key={permission.uid}
              >
                {permission.name}
              </BasicTag>
            </Popover>
          </EmptyBox>
        ))}
      </Space>
    );
  }
  return '-';
};
export default ProjectManagePermissions;
