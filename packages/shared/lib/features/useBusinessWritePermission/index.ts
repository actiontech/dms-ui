import { useMemo } from 'react';
import useCurrentUser from '../useCurrentUser';
import useCurrentProject from '../useCurrentProject';

/**
 * Hook to check if business write actions should be disabled for the current user.
 *
 * When a system administrator (or admin) has businessWritePermission=false,
 * business write operations should be disabled in the UI, UNLESS the user
 * has project-level manager permission in the current project (project admin
 * granted via project member config). In that case the project-level permission
 * takes precedence over the global BWP flag.
 *
 * This hook is safe to use both inside and outside a project route context:
 * - Inside a project route: projectID is non-empty, project-admin check is performed.
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

  // Determine if the user is a project manager (is_manager=true) in the current project.
  // If we are not in a project context (projectID empty), this is always false.
  // Note: projectID from URL params may be either the numeric UID (e.g. "700300")
  // or the project name (e.g. "default"), so we match against both project_id and
  // project_name to handle both navigation patterns robustly.
  const isProjectManagerInCurrentProject = useMemo(() => {
    if (!projectID) return false;
    const project = bindProjects.find(
      (v) => v.project_id === projectID || v.project_name === projectID
    );
    return !!project?.is_manager;
  }, [projectID, bindProjects]);

  const isBusinessWriteDisabled = useMemo(() => {
    if (
      (isAdmin || userRoles.systemAdministrator) &&
      !businessWritePermission
    ) {
      // Project-level manager permission overrides the global BWP=off flag.
      // Only applies when we are inside a project context.
      if (projectID && isProjectManagerInCurrentProject) {
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
    isProjectManagerInCurrentProject
  ]);

  return {
    isBusinessWriteDisabled,
    businessWritePermission
  };
};

export default useBusinessWritePermission;
