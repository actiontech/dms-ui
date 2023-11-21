import UserNavigate from './UserNavigate';
import { UserMenuProps } from './index.type';

const UserMenu: React.FC<UserMenuProps> = ({ username }) => {
  return (
    <>
      <div className="diagnosis-layout-side-end">
        <UserNavigate username={username} />
      </div>
    </>
  );
};

export default UserMenu;
