import { Space } from 'antd';
import RoleList from './RoleList';
import OpPermissionList from './OpPermissionList';

const RoleManager: React.FC = () => {
  return (
    <Space direction="vertical" size="large" className="full-width-element">
      <RoleList />
      <OpPermissionList />
    </Space>
  );
};

export default RoleManager;
