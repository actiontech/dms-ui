import { SystemRole } from '@actiontech/shared/lib/enum';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../store';
import { updateUserType } from '../../../../store/home';

const useUserTypeHooks = () => {
  const dispatch = useDispatch();
  const userType = useSelector((state: IReduxState) => state.home.userType);
  const onUserTypeChange = (type: string) => {
    dispatch(updateUserType({ userType: type }));
  };

  const isAdmin = userType === SystemRole.admin;

  return {
    isAdmin,
    onUserTypeChange,
    userType
  };
};

export default useUserTypeHooks;
