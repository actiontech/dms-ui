import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  CheckHexagonOutlined,
  CloseHexagonOutlined,
  InfoHexagonFilled
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
    return (
      <Space direction="vertical">
        <TableColumnWithIconStyleWrapper>
          <InfoHexagonFilled />
          <span>
            {t('dmsMember.memberList.columns.partialManagePermissions')}
          </span>
        </TableColumnWithIconStyleWrapper>
        <Space wrap>
          {managePermissions.map((permission) => (
            <BasicTag style={{ height: 28 }} size="small" key={permission.uid}>
              {permission.name}
            </BasicTag>
          ))}
        </Space>
      </Space>
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
