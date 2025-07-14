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

  const userRoles: UserRolesType = useMemo(() => {
    return {
      [SystemRole.admin]: isAdmin,
      [SystemRole.certainProjectManager]: isCertainProjectManager,
      [SystemRole.auditAdministrator]: managementPermissions.some(
        (v) => v.uid === OpPermissionTypeUid.audit_administrator
      ),
      [SystemRole.systemAdministrator]: managementPermissions.some(
        (v) => v.uid === OpPermissionTypeUid.system_administrator
      ),
      [SystemRole.projectDirector]: managementPermissions.some(
        (v) => v.uid === OpPermissionTypeUid.project_director
      )
    };
  }, [isAdmin, isCertainProjectManager, managementPermissions]);

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
    updateLanguage
  };
};
export default useCurrentUser;
