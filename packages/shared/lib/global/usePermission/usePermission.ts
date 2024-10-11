import { useCallback, useEffect, useMemo } from 'react';
import useCurrentUser from '../useCurrentUser';
import { PERMISSION_MANIFEST, PermissionDetail } from './permissionManifest';
import { PermissionsConstantType } from './permissions';
import useCurrentPermission from '../useCurrentPermission';
import useCurrentProject from '../useCurrentProject';
import { ActiontechTableActionsWithConstantPermissions } from './index.type';
import { ActiontechTableProps } from '../../components/ActiontechTable';
import { ActiontechTableActionsConfig } from '../../components/ActiontechTable/index.type';
import useUserOperationPermission from '../useUserOperationPermission';

const usePermission = () => {
  const { userRoles, bindProjects } = useCurrentUser();
  const { moduleSupportStatus } = useCurrentPermission();
  const { projectID } = useCurrentProject();
  const { updateUserOperationPermission, isHaveServicePermission } =
    useUserOperationPermission();

  const projectAttributesStatus = useMemo(() => {
    const isArchived = !!bindProjects.find(
      (project) => project.project_id === projectID
    )?.archived;

    return {
      isManager: !!bindProjects.find(
        (project) => project.project_id === projectID
      )?.is_manager,
      isArchived
    };
  }, [bindProjects, projectID]);

  const checkRoles = useCallback(
    (permissionDetails: PermissionDetail) => {
      if (!permissionDetails.role) {
        return true;
      }
      return permissionDetails.role.some((role) => userRoles[role]);
    },
    [userRoles]
  );

  const checkModuleSupport = useCallback(
    (permissionDetails: PermissionDetail) => {
      if (!permissionDetails.moduleSupport) {
        return true;
      }
      return permissionDetails.moduleSupport.some(
        (role) => moduleSupportStatus[role]
      );
    },
    [moduleSupportStatus]
  );

  const checkPagePermission = useCallback(
    (requiredPermission: PermissionsConstantType): boolean => {
      const permissionDetails = PERMISSION_MANIFEST[requiredPermission];
      return (
        checkRoles(permissionDetails) || checkModuleSupport(permissionDetails)
      );
    },
    [checkModuleSupport, checkRoles]
  );

  const checkActionPermission = useCallback(
    <T = Record<string, string>>(
      requiredPermission: PermissionsConstantType,
      record?: T
    ): boolean => {
      const permissionDetails = PERMISSION_MANIFEST[requiredPermission];

      // 检查项目是否已冻结
      if (
        permissionDetails.projectArchived !== undefined &&
        permissionDetails.projectArchived !== projectAttributesStatus.isArchived
      ) {
        return false;
      }

      // 检查角色或项目管理员权限
      const hasRoleOrManagerPermission =
        checkRoles(permissionDetails) ||
        (permissionDetails.projectManager === true &&
          projectAttributesStatus.isManager);

      if (permissionDetails.dbServicePermission) {
        const { fieldName, opType } = permissionDetails.dbServicePermission;
        return (
          hasRoleOrManagerPermission ||
          isHaveServicePermission(
            opType,
            (record as Record<string, string>)?.[fieldName]
          )
        );
      }

      return hasRoleOrManagerPermission;
    },
    [
      checkRoles,
      isHaveServicePermission,
      projectAttributesStatus.isArchived,
      projectAttributesStatus.isManager
    ]
  );

  const parse2TableActionPermissions = useCallback(
    <
      T = Record<string, any>,
      F = Record<string, any>,
      OtherColumnKeys extends string = never
    >(
      actions: ActiontechTableActionsWithConstantPermissions<
        T,
        F,
        OtherColumnKeys
      >
    ): ActiontechTableProps<T, F, OtherColumnKeys>['actions'] => {
      if (Array.isArray(actions)) {
        return actions.map((item) => ({
          ...item,
          permissions: item.permissions
            ? (record) => checkActionPermission(item.permissions!, record)
            : undefined
        }));
      }

      const parseActionMoreButtons = (
        moreButtons: typeof actions.moreButtons
      ): ActiontechTableActionsConfig<T, F, OtherColumnKeys>['moreButtons'] => {
        if (typeof moreButtons === 'function') {
          return (record: T) =>
            moreButtons(record).map((item) => ({
              ...item,
              permissions: item.permissions
                ? (data) => checkActionPermission(item.permissions!, data)
                : undefined
            }));
        }

        return moreButtons?.map((item) => ({
          ...item,
          permissions: item.permissions
            ? (record) => checkActionPermission(item.permissions!, record)
            : undefined
        }));
      };

      return {
        ...actions,
        buttons: actions.buttons.map((item) => ({
          ...item,
          permissions: item.permissions
            ? (record) => checkActionPermission(item.permissions!, record)
            : undefined
        })),
        moreButtons: parseActionMoreButtons(actions.moreButtons)
      };
    },
    [checkActionPermission]
  );

  useEffect(() => {
    updateUserOperationPermission();
  }, [updateUserOperationPermission]);

  return {
    checkPagePermission,
    checkActionPermission,
    parse2TableActionPermissions
  };
};

export default usePermission;
