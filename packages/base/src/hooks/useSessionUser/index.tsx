import { useRequest } from 'ahooks';
import { useDispatch } from 'react-redux';
import { ResponseCode } from '@actiontech/dms-kit';
import { updateUserUid } from '../../store/user';
import { useUserInfo } from '@actiontech/shared/lib/features';
import Session from '@actiontech/shared/lib/api/base/service/Session';
import User from '@actiontech/shared/lib/api/base/service/User';
import { GetUserSystemEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

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

  const {
    data: shouldNavigateToWorkbench,
    runAsync: getSessionUserInfoAsync,
    loading: getSessionUserSystemLoading
  } = useRequest(
    () =>
      Session.GetUserBySession({}).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const uid = res.data.data?.user_uid ?? '';
          return User.GetUser({ user_uid: uid }).then((resp) => {
            if (resp.data.code === ResponseCode.SUCCESS) {
              return resp.data.data?.system === GetUserSystemEnum.WORKBENCH;
            }
          });
        }
      }),
    {
      manual: true
    }
  );

  return {
    sessionUser,
    getSessionUserLoading,
    getUserBySession,
    getSessionUserInfoAsync,
    shouldNavigateToWorkbench,
    getSessionUserSystemLoading
  };
};

export default useSessionUser;
