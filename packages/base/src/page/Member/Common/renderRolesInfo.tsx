import {
  IListMemberRoleWithOpRange,
  IUidWithName
} from '@actiontech/shared/lib/api/base/service/common';
import { Space, Typography } from 'antd5';

const renderRolesInfo = (
  roles: IListMemberRoleWithOpRange[],
  ellipsis: boolean
) => {
  const genContent = (roleName: string, ranges: IUidWithName[]) =>
    `${roleName}: [ ${ranges?.map((range) => range.name)?.toString() ?? ''} ]`;

  return (
    <Space direction="vertical">
      {roles.map((v) => {
        const roleName = v?.role_uid?.name ?? '';
        const rangeUids = v?.range_uids ?? [];
        return ellipsis ? (
          <Typography.Text ellipsis={ellipsis} key={v.role_uid?.uid ?? ''}>
            {genContent(roleName, rangeUids)}
          </Typography.Text>
        ) : (
          <div key={v.role_uid?.uid ?? ''}>
            {genContent(roleName, rangeUids)}
          </div>
        );
      })}
    </Space>
  );
};

export default renderRolesInfo;
