import { useCallback } from 'react';
import useCurrentUser from '../useCurrentUser';
import { PERMISSION_MANIFEST } from './permissionManifest';
import { PermissionsConstantType } from './permissions';
import useCurrentPermission from '../useCurrentPermission';

const usePermission = () => {
  const { userRoles } = useCurrentUser();
  const { moduleSupportedStatus } = useCurrentPermission();

  const checkPagePermission = useCallback(
    (requiredPermission: PermissionsConstantType): boolean => {
      const manifest = PERMISSION_MANIFEST[requiredPermission];
      return (
        !!manifest.role?.some((role) => userRoles[role]) ||
        !!manifest.featureSupport?.some(
          (module) => moduleSupportedStatus[module]
        )
      );
    },
    [moduleSupportedStatus, userRoles]
  );

  return {
    checkPagePermission
  };
};

export default usePermission;
