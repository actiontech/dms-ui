import { useDispatch } from 'react-redux';
import useGetUserScope from '../useGetUserScope';
import { useRequest } from 'ahooks';
import auth from '../../api/auth';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { updateUser } from '../../store/user';

const useGetUserInfo = () => {
  const dispatch = useDispatch();
  const { getUserScopeByRoleId } = useGetUserScope();

  const {
    data: userInfo,
    loading: getUserInfoLoading,
    run: getUserInfo
  } = useRequest(auth.V1GetUser.bind(auth), {
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        const info = res.data?.data ?? {};
        dispatch(
          updateUser({
            username: info?.username ?? '',
            userId: info?.user_id ?? null,
            roleId: info?.role_id ?? null
          })
        );
        getUserScopeByRoleId({ role_id: 0 });
      }
    }
  });

  return {
    userInfo,
    getUserInfoLoading,
    getUserInfo
  };
};

export default useGetUserInfo;
