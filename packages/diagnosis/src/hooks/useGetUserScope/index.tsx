import auth from '../../api/auth';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useRequest } from 'ahooks';
import { useDispatch } from 'react-redux';
import { updateUserScope } from '../../store/user';

const useGetUserScope = () => {
  const dispatch = useDispatch();

  const {
    data: userScope,
    loading: getUserScopeLoading,
    run: getUserScopeByRoleId
  } = useRequest(auth.V1ListRoleScopes.bind(auth), {
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        dispatch(updateUserScope({ userScope: res.data?.data ?? [] }));
      }
    }
  });

  return {
    userScope,
    getUserScopeLoading,
    getUserScopeByRoleId
  };
};

export default useGetUserScope;
