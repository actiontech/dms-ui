import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../base/src/store';
import useCurrentUser from '../useCurrentUser';
import useCurrentProject from '../useCurrentProject';

/**
 * Hook to check if business write actions should be disabled for the current user.
 *
 * When a system administrator (or admin) has businessWritePermission=false,
 * business write operations should be disabled in the UI, UNLESS the user
 * has project-level authorization in the current project. Project-level
 * authorization includes:
 * - Being a project manager (is_manager=true in bindProjects)
 * - Having any explicit operation permission in the current project
 *   (e.g., data-source-level roles like "development engineer" that grant
 *   create_workflow, sql_query, pipeline permissions, etc.)
 *
 * This implements AC-1.4.3 / AC-1.8.5: BWP=off users with project-level
 * authorization can still perform business write operations within the
 * authorized project scope.
 *
 * This hook is safe to use both inside and outside a project route context:
 * - Inside a project route: projectID is non-empty, project-level check is performed.
 * - Outside a project route (global pages): projectID is empty, BWP=off always disables.
 *
 * @returns {object}
 * - isBusinessWriteDisabled: true when BWP=false and user has no project-level override
 * - businessWritePermission: raw BWP value from user info
 */
const useBusinessWritePermission = () => {
  const { isAdmin, userRoles, businessWritePermission, bindProjects } =
    useCurrentUser();
  const { projectID } = useCurrentProject();
  const { userOperationPermissions } = useSelector((state: IReduxState) => ({
    userOperationPermissions: state.permission.userOperationPermissions
  }));

  // Determine if the user has any project-level authorization in the current project.
  // This includes being a project manager (is_manager=true) OR having any explicit
  // operation permission (e.g., data-source-level create_workflow, sql_query, etc.).
  // If we are not in a project context (projectID empty), this is always false.
  // Note: projectID from URL params may be either the numeric UID (e.g. "700300")
  // or the project name (e.g. "default"), so we match against both project_id and
  // project_name to handle both navigation patterns robustly.
  const hasProjectLevelAuthorizationInCurrentProject = useMemo(() => {
    if (!projectID) return false;

    // Check 1: is_manager in bindProjects (project admin)
    const project = bindProjects.find(
      (v) => v.project_id === projectID || v.project_name === projectID
    );
    if (project?.is_manager) {
      return true;
    }

    // Check 2: any explicit operation permission in the current project
    // (e.g., data-source-level roles granted via project member config)
    if (userOperationPermissions?.op_permission_list?.length) {
      return userOperationPermissions.op_permission_list.some(
        (permission) =>
          // db_service-level permission means user has specific data source access
          // in this project (the op_permission_list is already scoped to current project)
          permission.range_uids?.length
      );
    }

    return false;
  }, [projectID, bindProjects, userOperationPermissions]);

  const isBusinessWriteDisabled = useMemo(() => {
    if (
      (isAdmin || userRoles.systemAdministrator) &&
      !businessWritePermission
    ) {
      // Project-level authorization overrides the global BWP=off flag.
      // Only applies when we are inside a project context.
      if (projectID && hasProjectLevelAuthorizationInCurrentProject) {
        return false;
      }
      return true;
    }
    return false;
  }, [
    isAdmin,
    userRoles.systemAdministrator,
    businessWritePermission,
    projectID,
    hasProjectLevelAuthorizationInCurrentProject
  ]);

  return {
    isBusinessWriteDisabled,
    businessWritePermission
  };
};

export default useBusinessWritePermission;
