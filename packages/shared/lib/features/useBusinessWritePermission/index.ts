import { useMemo } from 'react';
import useCurrentUser from '../useCurrentUser';

/**
 * Hook to check if business write actions should be disabled for the current user.
 *
 * When a system administrator (or admin) has businessWritePermission=false,
 * business write operations should be disabled in the UI.
 * This is a UI experience optimization - the backend also enforces this via
 * assignee mechanism and permission checks.
 *
 * @returns {object}
 * - isBusinessWriteDisabled: true when the user is admin/sysAdmin AND BWP=false
 * - businessWritePermission: raw BWP value from user info
 */
const useBusinessWritePermission = () => {
  const { isAdmin, userRoles, businessWritePermission } = useCurrentUser();

  const isBusinessWriteDisabled = useMemo(() => {
    if (
      (isAdmin || userRoles.systemAdministrator) &&
      !businessWritePermission
    ) {
      return true;
    }
    return false;
  }, [isAdmin, userRoles.systemAdministrator, businessWritePermission]);

  return {
    isBusinessWriteDisabled,
    businessWritePermission
  };
};

export default useBusinessWritePermission;
