import { useRequest } from 'ahooks';
import { useDispatch } from 'react-redux';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { updateUserUid } from '../../store/user';
import { useUserInfo } from '@actiontech/shared/lib/global';
import dms from '@actiontech/shared/lib/api/base/service/dms';

const useSessionUser = () => {
  const dispatch = useDispatch();
  const { getUserInfo } = useUserInfo();

  const {
    data: sessionUser,
    loading: getSessionUserLoading,
    run: getUserBySession
  } = useRequest(dms.GetUserBySession.bind(dms), {
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
