import { useRequest } from 'ahooks';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IReduxState } from '../../../../base/src/store';
import {
  updateBindProjects,
  updateManagementPermissions,
  updateToken,
  updateUser,
  updateUserInfoFetchStatus,
  updateUserUid
} from '../../../../base/src/store/user';
import { ResponseCode, SystemRole } from '../../enum';
import dms from '../../api/base/service/dms';

const useUserInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state: IReduxState) => state.user.uid);

  const clearUserInfo = useCallback(() => {
    dispatch(
      updateUser({
        username: '',
        role: ''
      })
    );
    dispatch(
      updateUserUid({
        uid: ''
      })
    );
    dispatch(
      updateToken({
        token: ''
      })
    );

    dispatch(
      updateBindProjects({
        bindProjects: []
      })
    );
    dispatch(
      updateManagementPermissions({
        managementPermissions: []
      })
    );
    dispatch(updateUserInfoFetchStatus(false));
  }, [dispatch]);

  const {
    loading: getUserInfoLoading,
    run: getUserInfo,
    refresh: updateUserInfo,
    data: userInfo
  } = useRequest(
    (sessionUid?: string) => dms.GetUser({ user_uid: sessionUid ?? userId }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const { data } = res.data;
          dispatch(
            updateUser({
              username: data?.name ?? '',
              role: data?.is_admin ? SystemRole.admin : ''
            })
          );

          dispatch(
            updateBindProjects({
              bindProjects: data?.user_bind_projects ?? []
            })
          );

          dispatch(
            updateManagementPermissions({
              managementPermissions: data?.op_permissions ?? []
            })
          );

          dispatch(updateUserInfoFetchStatus(true));
        } else {
          clearUserInfo();
          navigate(`/login`, { replace: true });
        }
      },
      onError: () => {
        clearUserInfo();
        navigate(`/login`, {
          replace: true
        });
      }
    }
  );

  return {
    getUserInfoLoading,
    getUserInfo,
    updateUserInfo,
    clearUserInfo,
    userInfo
  };
};

export default useUserInfo;
