import { useSelector } from 'react-redux';
import { IReduxState } from '../../store';

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

  return {
    username,
    userId,
    roleId,
    userScope
  };
};
export default useCurrentUser;
