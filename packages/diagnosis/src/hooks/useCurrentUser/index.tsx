import { useSelector } from 'react-redux';
import { IReduxState } from '../../store';
import { useCallback } from 'react';
import { AdminRolePermission } from '../../data/enum';

const useCurrentUser = () => {
  const { username, userId, roleId, userScope } = useSelector(
    (state: IReduxState) => {
      return {
        username: state.user.username,
        userId: state.user.userId,
        roleId: state.user.roleId,
        userScope: state.user.userScope
      };
    }
  );

  const hasActionPermission = useCallback(
    (permission: AdminRolePermission) => {
      return !!userScope.find((item) => item?.scope_name === permission);
    },
    [userScope]
  );

  return {
    username,
    userId,
    roleId,
    userScope,
    hasActionPermission
  };
};
export default useCurrentUser;
