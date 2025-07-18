import { useCallback } from 'react';
import useCurrentUser from '../useCurrentUser';
import { PERMISSION_MANIFEST, PermissionDetail } from './permissionManifest';
import { PermissionsConstantType } from './permissions';
import useCurrentProject from '../useCurrentProject';
import {
  ActiontechTableActionsWithPermissions,
  ActiontechTableToolbarActionWithPermissions,
  CheckActionPermissionOtherValues
} from './index.type';
import { ActiontechTableProps } from '../../components/ActiontechTable';
import {
  ActiontechTableActionsConfig,
  ActiontechTableToolbarActionMeta
} from '../../components/ActiontechTable/index.type';
import {
  OpPermissionItemOpPermissionTypeEnum,
  OpPermissionItemRangeTypeEnum
} from '../../api/base/service/common.enum';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../base/src/store';

const usePermission = () => {
  const { userRoles, bindProjects } = useCurrentUser();
  const { moduleFeatureSupport, userOperationPermissions } = useSelector(
    (state: IReduxState) => ({
      moduleFeatureSupport: state.permission.moduleFeatureSupport,
      userOperationPermissions: state.permission.userOperationPermissions
    })
  );
  const { projectID } = useCurrentProject();

  const getProjectAttributesStatus = useCallback(
    (targetProjectID = projectID) => {
      const isArchived = !!bindProjects.find(
        (project) => project.project_id === targetProjectID
      )?.archived;
      return {
        isManager: !!bindProjects.find(
          (project) => project.project_id === targetProjectID
        )?.is_manager,
        isArchived
      };
    },
    [bindProjects, projectID]
  );

  const checkDbServicePermission = useCallback(
    (
      opPermissionType: OpPermissionItemOpPermissionTypeEnum,
      authDataSourceId?: string
    ) => {
      if (userOperationPermissions) {
        const { is_admin, op_permission_list } = userOperationPermissions;
        const isProjctAdmin = op_permission_list?.some((permission) => {
          if (
            permission.range_type === OpPermissionItemRangeTypeEnum.project &&
            permission.range_uids?.includes(projectID) &&
            permission.op_permission_type ===
              OpPermissionItemOpPermissionTypeEnum.project_admin
          ) {
            return true;
          }
          return false;
        });

        const hasServicePermission = op_permission_list?.some((permission) => {
          if (
            permission.range_type ===
              OpPermissionItemRangeTypeEnum.db_service &&
            (authDataSourceId
              ? permission.range_uids?.includes(authDataSourceId)
              : permission.range_uids?.length) &&
            permission.op_permission_type === opPermissionType
          ) {
            return true;
          }
          return false;
        });
        if (is_admin || isProjctAdmin || hasServicePermission) {
          return true;
        }

        return false;
      }
      return false;
    },
    [userOperationPermissions, projectID]
  );

  const checkProjectPermission = useCallback(
    (opPermissionType?: OpPermissionItemOpPermissionTypeEnum) => {
      if (userOperationPermissions) {
        if (!opPermissionType) {
          return false;
        }
        const { is_admin, op_permission_list } = userOperationPermissions;
        const hasProjectPermission = op_permission_list?.some((permission) => {
          if (
            permission.range_type === OpPermissionItemRangeTypeEnum.project &&
            permission.op_permission_type === opPermissionType
          ) {
            return true;
          }
          return false;
        });

        if (is_admin || hasProjectPermission) {
          return true;
        }

        return false;
      }
      return false;
    },
    [userOperationPermissions]
  );

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
        (module) => moduleFeatureSupport[module]
      );
    },
    [moduleFeatureSupport]
  );

  const checkPagePermission = useCallback(
    (requiredPermission: PermissionsConstantType): boolean => {
      const permissionDetails = PERMISSION_MANIFEST[requiredPermission];

      const hasProjectPermission = checkProjectPermission(
        permissionDetails.projectPermission
      );
      return (
        (checkRoles(permissionDetails) || hasProjectPermission) &&
        checkModuleSupport(permissionDetails)
      );
    },
    [checkModuleSupport, checkRoles, checkProjectPermission]
  );

  const checkActionPermission = useCallback(
    <T = Record<string, string>>(
      requiredPermission: PermissionsConstantType,
      otherValues?: CheckActionPermissionOtherValues<T>
    ): boolean => {
      const { record, authDataSourceId, targetProjectID } = otherValues ?? {};

      const permissionDetails = PERMISSION_MANIFEST[requiredPermission];
      const projectAttributesStatus =
        getProjectAttributesStatus(targetProjectID);

      // 检查项目是否已冻结
      if (
        permissionDetails.projectArchived !== undefined &&
        permissionDetails.projectArchived !== projectAttributesStatus.isArchived
      ) {
        return false;
      }

      // 是否有对应的项目管理权限
      const hasProjectPermission = checkProjectPermission(
        permissionDetails.projectPermission
      );

      // 检查角色或项目管理员权限
      const hasRoleOrManagerPermission =
        checkRoles(permissionDetails) ||
        (permissionDetails.projectManager === true &&
          projectAttributesStatus.isManager) ||
        hasProjectPermission;

      if (permissionDetails.dbServicePermission) {
        const { fieldName, opType } = permissionDetails.dbServicePermission;
        return (
          hasRoleOrManagerPermission ||
          checkDbServicePermission(
            opType,
            fieldName
              ? (record as Record<string, string>)?.[fieldName]
              : authDataSourceId
          )
        );
      }

      return hasRoleOrManagerPermission;
    },
    [
      getProjectAttributesStatus,
      checkRoles,
      checkDbServicePermission,
      checkProjectPermission
    ]
  );

  const parse2TableActionPermissions = useCallback(
    <
      T = Record<string, any>,
      F = Record<string, any>,
      OtherColumnKeys extends string = never
    >(
      actions: ActiontechTableActionsWithPermissions<T, F, OtherColumnKeys>
    ): ActiontechTableProps<T, F, OtherColumnKeys>['actions'] => {
      if (Array.isArray(actions)) {
        return actions.map((item) => ({
          ...item,
          permissions: item.permissions
            ? (record) => checkActionPermission(item.permissions!, { record })
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
                ? (data) =>
                    checkActionPermission(item.permissions!, { record: data })
                : undefined
            }));
        }

        return moreButtons?.map((item) => ({
          ...item,
          permissions: item.permissions
            ? (record) => checkActionPermission(item.permissions!, { record })
            : undefined
        }));
      };

      return {
        ...actions,
        buttons: actions.buttons.map((item) => ({
          ...item,
          permissions: item.permissions
            ? (record) => checkActionPermission(item.permissions!, { record })
            : undefined
        })),
        moreButtons: parseActionMoreButtons(actions.moreButtons)
      };
    },
    [checkActionPermission]
  );

  const parse2TableToolbarActionPermissions = useCallback(
    (
      actions: ActiontechTableToolbarActionWithPermissions
    ): ActiontechTableToolbarActionMeta[] => {
      return actions.map((item) => ({
        ...item,
        permissions: item.permissions
          ? checkActionPermission(item.permissions!)
          : undefined
      }));
    },
    [checkActionPermission]
  );

  return {
    moduleFeatureSupport,
    userOperationPermissions,
    checkDbServicePermission,
    checkPagePermission,
    checkActionPermission,
    parse2TableActionPermissions,
    parse2TableToolbarActionPermissions,
    checkProjectPermission
  };
};

export default usePermission;
