import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { IReduxState } from '../../../../base/src/store';
import { SupportTheme, SystemRole, UserRolesType } from '../../enum';
import { updateTheme as _updateTheme } from '../../../../base/src/store/user';

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const {
    role,
    bindProjects,
    managementPermissions,
    username,
    theme,
    useInfoFetched,
    uid
  } = useSelector((state: IReduxState) => {
    return {
      username: state.user.username,
      role: state.user.role,
      bindProjects: state.user.bindProjects,
      managementPermissions: state.user.managementPermissions,
      theme: state.user.theme,
      useInfoFetched: state.user.useInfoFetched,
      uid: state.user.uid
    };
  });

  const isAdmin: boolean = role === SystemRole.admin;
  const isProjectManager = useCallback(
    (name: string) => {
      const project = bindProjects.find((v) => v.project_name === name);
      return !!project && !!project.is_manager;
    },
    [bindProjects]
  );
  const updateTheme = useCallback(
    (_theme: SupportTheme) => {
      dispatch(_updateTheme({ theme: _theme }));
    },
    [dispatch]
  );

  const isCertainProjectManager = useMemo(() => {
    return bindProjects?.some((v) => v.is_manager) ?? false;
  }, [bindProjects]);

  const userRoles: UserRolesType = {
    [SystemRole.admin]: isAdmin,
    [SystemRole.certainProjectManager]: isCertainProjectManager
  };

  return {
    isAdmin,
    isProjectManager,
    bindProjects,
    managementPermissions,
    username,
    role,
    theme,
    updateTheme,
    useInfoFetched,
    uid,
    isCertainProjectManager,
    userRoles
  };
};
export default useCurrentUser;
