import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { IReduxState } from '../../../../base/src/store';
import {
  OpPermissionTypeUid,
  SupportLanguage,
  SupportTheme,
  SystemRole,
  UserRolesType
} from '../../enum';
import {
  updateTheme as updateReduxTheme,
  updateLanguage as updateReduxLanguage
} from '../../../../base/src/store/user';

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const {
    role,
    bindProjects,
    managementPermissions,
    username,
    theme,
    isUserInfoFetched,
    userId,
    language
  } = useSelector((state: IReduxState) => {
    return {
      username: state.user.username,
      role: state.user.role,
      bindProjects: state.user.bindProjects,
      managementPermissions: state.user.managementPermissions,
      theme: state.user.theme,
      isUserInfoFetched: state.user.isUserInfoFetched,
      userId: state.user.uid,
      language: state.user.language
    };
  });

  const isAdmin = role === SystemRole.admin;

  const isProjectManager = useCallback(
    (name: string) => {
      const project = bindProjects.find((v) => v.project_name === name);
      return !!project && !!project.is_manager;
    },
    [bindProjects]
  );
  const updateTheme = useCallback(
    (selectedTheme: SupportTheme) => {
      dispatch(updateReduxTheme({ theme: selectedTheme }));
    },
    [dispatch]
  );
  const updateLanguage = useCallback(
    (selectedLanguage: SupportLanguage) => {
      dispatch(
        updateReduxLanguage({ language: selectedLanguage, store: true })
      );
    },
    [dispatch]
  );

  const isCertainProjectManager = useMemo(() => {
    return bindProjects?.some((v) => v.is_manager) ?? false;
  }, [bindProjects]);

  const hasGlobalViewingPermission = useMemo(() => {
    return managementPermissions.some(
      (v) => v.uid === OpPermissionTypeUid.global_viewing
    );
  }, [managementPermissions]);

  const userRoles: UserRolesType = useMemo(() => {
    return {
      [SystemRole.admin]: isAdmin,
      [SystemRole.certainProjectManager]: isCertainProjectManager,
      [SystemRole.globalViewing]: hasGlobalViewingPermission,
      [SystemRole.globalManager]: managementPermissions.some(
        (v) => v.uid === OpPermissionTypeUid.global_management
      ),
      [SystemRole.createProject]: managementPermissions.some(
        (v) => v.uid === OpPermissionTypeUid.create_project
      )
    };
  }, [
    hasGlobalViewingPermission,
    isAdmin,
    isCertainProjectManager,
    managementPermissions
  ]);

  return {
    isAdmin,
    isProjectManager,
    bindProjects,
    managementPermissions,
    username,
    role,
    theme,
    updateTheme,
    isUserInfoFetched,
    userId,
    isCertainProjectManager,
    userRoles,
    language,
    updateLanguage,
    hasGlobalViewingPermission
  };
};
export default useCurrentUser;
