import UserList from './UserList';
import UserGroupList from './UserGroupList';
import { Space } from 'antd';

const UserManage: React.FC = () => {
  return (
    <>
      <Space direction="vertical" size="large" className="full-width-element">
        <UserList />
        <UserGroupList />
      </Space>
    </>
  );
};

export default UserManage;
