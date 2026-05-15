import React from 'react';
import usePermission from '../usePermission/usePermission';
import { PermissionControlProps } from './index.type';

const PermissionControl: React.FC<PermissionControlProps> = ({
  permission,
  children,
  projectID,
  authDataSourceId,
  skipBWPCheck
}) => {
  const { checkActionPermission, checkActionDisabledByBWP } = usePermission();

  if (
    checkActionPermission(permission, {
      targetProjectID: projectID,
      authDataSourceId
    })
  ) {
    const bwpDisabled = !skipBWPCheck && checkActionDisabledByBWP(permission);
    if (bwpDisabled) {
      return (
        <>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(
                child as React.ReactElement<Record<string, unknown>>,
                { disabled: true }
              );
            }
            return child;
          })}
        </>
      );
    }
    return <>{children}</>;
  }

  return null;
};

PermissionControl.displayName = 'PermissionControl';

export default PermissionControl;
