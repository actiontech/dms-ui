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
import { ActiontechTableProps } from '@actiontech/dms-kit/es/components/ActiontechTable';
import {
  ActiontechTableActionsConfig,
  ActiontechTableToolbarActionMeta
} from '@actiontech/dms-kit/es/components/ActiontechTable/index.type';
import {
  OpPermissionItemOpPermissionTypeEnum,
  OpPermissionItemRangeTypeEnum
} from '../../api/base/service/common.enum';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../base/src/store';
import useBusinessWritePermission from '../useBusinessWritePermission';

const usePermission = () => {
  const { userRoles, bindProjects } = useCurrentUser();
  const { isBusinessWriteDisabled, isBWPOff } = useBusinessWritePermission();
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
        const { op_permission_list } = userOperationPermissions;
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
        if (isProjctAdmin || hasServicePermission) {
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

  const checkActionDisabledByBWP = useCallback(
    (
      requiredPermission: PermissionsConstantType,
      otherValues?: {
        record?: Record<string, string>;
        authDataSourceId?: string;
      }
    ): boolean => {
      const permissionDetails = PERMISSION_MANIFEST[requiredPermission];
      // Non-businessWrite actions are never disabled by BWP
      if (permissionDetails.businessWrite !== true) {
        return false;
      }
      // BWP is on, or user is not admin/systemAdministrator => no BWP restriction
      if (!isBWPOff) {
        return false;
      }
      // BWP=off and user has NO project-level authorization at all => disabled
      if (isBusinessWriteDisabled) {
        return true;
      }

      // BWP=off but user has project-level authorization (isBusinessWriteDisabled=false).
      // In this case, we must check whether the user actually has the SPECIFIC
      // permission for this particular action. If the action requires a
      // dbServicePermission or projectPermission that the user doesn't have,
      // the button should remain disabled.
      //
      // This fixes the bug where having ANY project role (e.g., "development
      // engineer" with create_workflow) would enable ALL businessWrite buttons
      // (including data export, data masking, etc.).

      // Check project-level permission (e.g., desensitization, manage_role_mange)
      if (permissionDetails.projectPermission) {
        if (checkProjectPermission(permissionDetails.projectPermission)) {
          return false; // User has this specific project permission => not disabled
        }
      }

      // Check db-service-level permission (e.g., create_workflow, version_manage)
      if (permissionDetails.dbServicePermission) {
        const { fieldName, opType } = permissionDetails.dbServicePermission;
        const recordTyped = otherValues?.record as
          | Record<string, string>
          | undefined;
        if (
          checkDbServicePermission(
            opType,
            fieldName ? recordTyped?.[fieldName] : otherValues?.authDataSourceId
          )
        ) {
          return false; // User has this specific db-service permission => not disabled
        }
      }

      // Check if user is project manager (project managers can do everything)
      if (permissionDetails.projectManager === true) {
        const { isManager } = getProjectAttributesStatus();
        if (isManager) {
          return false;
        }
      }

      // If the action has no specific dbServicePermission and no projectPermission
      // requirement, it is a generic businessWrite action (like workflow approve,
      // batch close, etc.). Since the user already has project-level authorization
      // (isBusinessWriteDisabled=false), these generic actions should be enabled.
      // Their access control is handled by other mechanisms (e.g., assignee checks).
      if (
        !permissionDetails.dbServicePermission &&
        !permissionDetails.projectPermission
      ) {
        return false;
      }

      // User has a specific permission requirement but doesn't meet it => disabled
      return true;
    },
    [
      isBWPOff,
      isBusinessWriteDisabled,
      checkProjectPermission,
      checkDbServicePermission,
      getProjectAttributesStatus
    ]
  );

  const mergeActionButtonPropsWithBWPDisabled = useCallback(
    <T>(
      buttonProps: ((record?: T) => Record<string, any>) | undefined,
      bwpDisabled: boolean | ((record?: T) => boolean)
    ): ((record?: T) => Record<string, any>) | undefined => {
      if (typeof bwpDisabled === 'function') {
        // Per-record BWP check: evaluate lazily for each row
        if (typeof buttonProps === 'function') {
          return (record?: T) => {
            const disabled = bwpDisabled(record);
            return disabled
              ? { ...buttonProps(record), disabled: true }
              : buttonProps(record);
          };
        }
        return (record?: T) => {
          const disabled = bwpDisabled(record);
          return disabled ? { disabled: true } : {};
        };
      }
      if (!bwpDisabled) return buttonProps;
      if (typeof buttonProps === 'function') {
        return (record?: T) => ({
          ...buttonProps(record),
          disabled: true
        });
      }
      return () => ({ disabled: true });
    },
    []
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
        return actions.map((item) => {
          // Create per-record BWP check that passes record context for
          // db-service-level permission evaluation
          const bwpDisabledFn = item.permissions
            ? (record?: T) =>
                checkActionDisabledByBWP(item.permissions!, {
                  record: record as unknown as Record<string, string>
                })
            : false;
          return {
            ...item,
            permissions: item.permissions
              ? (record) => checkActionPermission(item.permissions!, { record })
              : undefined,
            buttonProps: mergeActionButtonPropsWithBWPDisabled(
              item.buttonProps,
              bwpDisabledFn
            )
          };
        });
      }

      const parseActionMoreButtons = (
        moreButtons: typeof actions.moreButtons
      ): ActiontechTableActionsConfig<T, F, OtherColumnKeys>['moreButtons'] => {
        if (typeof moreButtons === 'function') {
          return (record: T) =>
            moreButtons(record).map((item) => {
              const bwpDisabled = item.permissions
                ? checkActionDisabledByBWP(item.permissions!, {
                    record: record as unknown as Record<string, string>
                  })
                : false;
              return {
                ...item,
                permissions: item.permissions
                  ? (data) =>
                      checkActionPermission(item.permissions!, { record: data })
                  : undefined,
                disabled: bwpDisabled || !!item.disabled
              };
            });
        }

        return moreButtons?.map((item) => {
          const bwpDisabled = item.permissions
            ? checkActionDisabledByBWP(item.permissions)
            : false;
          return {
            ...item,
            permissions: item.permissions
              ? (record) => checkActionPermission(item.permissions!, { record })
              : undefined,
            disabled: bwpDisabled || !!item.disabled
          };
        });
      };

      return {
        ...actions,
        buttons: actions.buttons.map((item) => {
          // Create per-record BWP check for row-level buttons
          const bwpDisabledFn = item.permissions
            ? (record?: T) =>
                checkActionDisabledByBWP(item.permissions!, {
                  record: record as unknown as Record<string, string>
                })
            : false;
          return {
            ...item,
            permissions: item.permissions
              ? (record) => checkActionPermission(item.permissions!, { record })
              : undefined,
            buttonProps: mergeActionButtonPropsWithBWPDisabled(
              item.buttonProps,
              bwpDisabledFn
            )
          };
        }),
        moreButtons: parseActionMoreButtons(actions.moreButtons)
      };
    },
    [
      checkActionPermission,
      checkActionDisabledByBWP,
      mergeActionButtonPropsWithBWPDisabled
    ]
  );

  const parse2TableToolbarActionPermissions = useCallback(
    (
      actions: ActiontechTableToolbarActionWithPermissions
    ): ActiontechTableToolbarActionMeta[] => {
      return actions.map((item) => {
        const bwpDisabled = item.permissions
          ? checkActionDisabledByBWP(item.permissions)
          : false;
        return {
          ...item,
          permissions: item.permissions
            ? checkActionPermission(item.permissions!)
            : undefined,
          buttonProps: {
            ...item.buttonProps,
            ...(bwpDisabled ? { disabled: true } : {})
          }
        };
      });
    },
    [checkActionPermission, checkActionDisabledByBWP]
  );

  return {
    moduleFeatureSupport,
    userOperationPermissions,
    checkDbServicePermission,
    checkPagePermission,
    checkActionPermission,
    checkActionDisabledByBWP,
    parse2TableActionPermissions,
    parse2TableToolbarActionPermissions,
    checkProjectPermission
  };
};

export default usePermission;
