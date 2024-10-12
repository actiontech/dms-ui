import { Space } from 'antd';
import PermissionControl from './PermissionControl';
import { PermissionControlGroupProps } from './index.type';

const PermissionControlGroup: React.FC<PermissionControlGroupProps> = ({
  actions,
  ...spaceProps
}) => {
  return (
    <Space {...spaceProps}>
      {actions.map(({ key, ...action }) => {
        return <PermissionControl key={key} {...action} />;
      })}
    </Space>
  );
};

PermissionControlGroup.displayName = 'PermissionControlGroup';

export default PermissionControlGroup;
