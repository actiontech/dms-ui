import React from 'react';
import { UserAvatarStyleWrapper } from './style';

type UserAvatarProps = {
  data: string;
};

const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  return (
    <UserAvatarStyleWrapper
      name={props.data}
      size="small"
      toolTipsWrapperClassName="work-flow-auth-avatar-wrapper"
      className="work-flow-auth-avatar"
    />
  );
};

export default UserAvatar;
