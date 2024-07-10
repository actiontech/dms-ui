import { useRequest } from 'ahooks';
import { useDispatch } from 'react-redux';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { updateUserUid } from '../../store/user';
import { useUserInfo } from '@actiontech/shared/lib/global';
import Session from '@actiontech/shared/lib/api/base/service/Session';

const useSessionUser = () => {
  const dispatch = useDispatch();
  const { getUserInfo } = useUserInfo();

  const {
    data: sessionUser,
    loading: getSessionUserLoading,
    run: getUserBySession
  } = useRequest(Session.GetUserBySession.bind(Session), {
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        const uid = res.data.data?.user_uid ?? '';
        dispatch(
          updateUserUid({
            uid
          })
        );
        getUserInfo(uid);
      }
    }
  });

  return {
    sessionUser,
    getSessionUserLoading,
    getUserBySession
  };
};

export default useSessionUser;
