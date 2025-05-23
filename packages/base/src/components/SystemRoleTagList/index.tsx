import { BasicTag, BasicTagProps } from '@actiontech/shared';
import { Space } from 'antd';
import { orderBy } from 'lodash';
import { OpPermissionTypeUid } from '@actiontech/shared/lib/enum';
import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';

export interface SystemRoleTagListProps {
  roles?: IUidWithName[];
}

const SystemRoleTagList: React.FC<SystemRoleTagListProps> = ({
  roles = []
}) => {
  if (!Array.isArray(roles) || roles.length === 0) {
    return <>-</>;
  }

  const getPermissionTagColor = (uid: string): BasicTagProps['color'] => {
    switch (uid) {
      case OpPermissionTypeUid.project_director:
        return 'orange';
      case OpPermissionTypeUid.audit_administrator:
        return 'blue';
      case OpPermissionTypeUid.system_administrator:
        return 'purple';
      default:
        return 'default';
    }
  };

  return (
    <Space size={[0, 4]} wrap>
      {orderBy(roles, ['uid'], ['asc']).map((role) => (
        <BasicTag
          style={{ height: 28 }}
          size="small"
          color={getPermissionTagColor(role.uid || '')}
          key={role.uid}
        >
          {role.name}
        </BasicTag>
      ))}
    </Space>
  );
};

export default SystemRoleTagList;
