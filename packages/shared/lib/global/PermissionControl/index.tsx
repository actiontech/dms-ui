import usePermission from '../usePermission/usePermission';
import { PermissionControlProps } from './index.type';

const PermissionControl: React.FC<PermissionControlProps> = ({
  permission,
  children,
  projectID,
  authDataSourceId
}) => {
  const { checkActionPermission } = usePermission(projectID);

  if (checkActionPermission(permission, undefined, authDataSourceId)) {
    return <>{children}</>;
  }

  return null;
};

PermissionControl.displayName = 'PermissionControl';

export default PermissionControl;
