import { useTranslation } from 'react-i18next';
import { Space, Popover } from 'antd';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  CheckHexagonOutlined,
  CloseHexagonOutlined,
  HexagonOutlined
} from '@actiontech/icons';
import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';
import { BasicTag } from '@actiontech/shared';

interface ProjectManagePermissionsProps {
  isProjectAdmin: boolean;
  managePermissions?: IUidWithName[];
}

const ProjectManagePermissions: React.FC<ProjectManagePermissionsProps> = ({
  isProjectAdmin,
  managePermissions = []
}) => {
  const { t } = useTranslation();

  if (isProjectAdmin) {
    return (
      <TableColumnWithIconStyleWrapper>
        <CheckHexagonOutlined />
        <span>{t('dmsMember.memberList.columns.projectAdmin')}</span>
      </TableColumnWithIconStyleWrapper>
    );
  }

  if (managePermissions.length > 0) {
    const permissionContent = (
      <Space wrap>
        {managePermissions.map((permission) => (
          <BasicTag key={permission.uid}>{permission.name}</BasicTag>
        ))}
      </Space>
    );

    return (
      <Popover content={permissionContent} placement="topLeft">
        <TableColumnWithIconStyleWrapper>
          <HexagonOutlined />
          <span>
            {t('dmsMember.memberList.columns.partialManagePermissions')}
          </span>
        </TableColumnWithIconStyleWrapper>
      </Popover>
    );
  }

  return (
    <TableColumnWithIconStyleWrapper>
      <CloseHexagonOutlined />
      <span>{t('dmsMember.memberList.columns.noManagePermissions')}</span>
    </TableColumnWithIconStyleWrapper>
  );
};

export default ProjectManagePermissions;
