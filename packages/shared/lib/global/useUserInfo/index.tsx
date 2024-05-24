import { useRequest } from 'ahooks';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { DMS_REDIRECT_KEY_PARAMS_NAME } from '../../data/common';

const useUserInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, bindProjects } = useSelector((state: IReduxState) => ({
    userId: state.user.uid,
    bindProjects: state.user.bindProjects
  }));

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
              bindProjects:
                data?.user_bind_projects?.map((project) => ({
                  ...project,
                  archived:
                    bindProjects?.find(
                      (i) => i.project_id === project.project_id
                    )?.archived ?? false
                })) ?? []
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
          navigate(
            `/login?${DMS_REDIRECT_KEY_PARAMS_NAME}=${location.pathname}`,
            { replace: true }
          );
        }
      },
      onError: () => {
        clearUserInfo();
        navigate(
          `/login?${DMS_REDIRECT_KEY_PARAMS_NAME}=${location.pathname}`,
          {
            replace: true
          }
        );
      }
    }
  );

  return {
    getUserInfoLoading,
    getUserInfo,
    updateUserInfo,
    clearUserInfo,
    userInfo: userInfo?.data.data
  };
};

export default useUserInfo;
