import usePermission from '../usePermission/usePermission';
import { PermissionControlProps } from './index.type';

const PermissionControl: React.FC<PermissionControlProps> = ({
  permission,
  children,
  projectID,
  authDataSourceId
}) => {
  const { checkActionPermission } = usePermission();

  if (
    checkActionPermission(permission, {
      targetProjectID: projectID,
      authDataSourceId
    })
  ) {
    return <>{children}</>;
  }

  return null;
};

PermissionControl.displayName = 'PermissionControl';

export default PermissionControl;
