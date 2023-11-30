import { useDispatch } from 'react-redux';
import useGetUserScope from '../useGetUserScope';
import { useRequest } from 'ahooks';
import auth from '../../api/auth';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { updateToken, updateUser, updateUserScope } from '../../store/user';
import { useNavigate } from 'react-router-dom';

const useGetUserInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getUserScopeByRoleId } = useGetUserScope();

  const clearUserInfo = () => {
    dispatch(
      updateUser({
        username: '',
        userId: null,
        roleId: null
      })
    );
    dispatch(updateToken({ token: '' }));
    dispatch(updateUserScope({ userScope: [] }));
  };

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
            userId: info?.user_id?.toString() ?? null,
            roleId: info?.role_id?.toString() ?? null
          })
        );
        getUserScopeByRoleId({ role_id: 0 });
      } else {
        clearUserInfo();
        navigate('/login', { replace: true });
      }
    },
    onError: () => {
      clearUserInfo();
      navigate('/login', { replace: true });
    }
  });

  return {
    userInfo,
    getUserInfoLoading,
    getUserInfo,
    clearUserInfo
  };
};

export default useGetUserInfo;
