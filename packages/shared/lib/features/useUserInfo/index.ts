import { useRequest } from 'ahooks';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { IReduxState } from '../../../../base/src/store';
import {
  updateBindProjects,
  updateManagementPermissions,
  updateToken,
  updateUser,
  updateUserInfoFetchStatus,
  updateUserUid,
  updateLanguage
} from '../../../../base/src/store/user';
import { ResponseCode, SupportLanguage, SystemRole } from '../../enum';
import User from '../../api/base/service/User';
import { DEFAULT_LANGUAGE } from '../../locale';
import { useTypedNavigate } from '../../components/TypedRouter';
import { ROUTE_PATHS } from '../../data/routePaths';

const useUserInfo = () => {
  const dispatch = useDispatch();
  const navigate = useTypedNavigate();
  const location = useLocation();
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
    runAsync: getUserInfoAsync,
    refresh: updateUserInfo,
    data: userInfo
  } = useRequest(
    (sessionUid?: string) => User.GetUser({ user_uid: sessionUid ?? userId }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const { data } = res.data;
          let language = DEFAULT_LANGUAGE;
          if (
            data?.language === SupportLanguage.enUS ||
            data?.language === SupportLanguage.zhCN
          ) {
            language = data.language;
          }

          dispatch(
            updateUser({
              username: data?.name ?? '',
              role: data?.is_admin ? SystemRole.admin : ''
            })
          );
          dispatch(
            updateLanguage({
              language,
              store: !!data?.language
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
          navigate(ROUTE_PATHS.BASE.LOGIN.index, {
            replace: true,
            queries: { target: encodeURIComponent(location.pathname) }
          });
        }
      },
      onError: () => {
        clearUserInfo();
        navigate(ROUTE_PATHS.BASE.LOGIN.index, {
          replace: true,
          queries: { target: encodeURIComponent(location.pathname) }
        });
      }
    }
  );

  return {
    getUserInfoLoading,
    getUserInfo,
    getUserInfoAsync,
    updateUserInfo,
    clearUserInfo,
    userInfo: userInfo?.data.data
  };
};

export default useUserInfo;
