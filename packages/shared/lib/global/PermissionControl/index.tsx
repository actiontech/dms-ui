import usePermission from '../usePermission/usePermission';
import { PermissionControlProps } from './index.type';

const PermissionControl: React.FC<PermissionControlProps> = ({
  permission,
  children,
  projectID,
  dbServiceID
}) => {
  const { checkActionPermission } = usePermission(projectID);

  if (checkActionPermission(permission, undefined, dbServiceID)) {
    return <>{children}</>;
  }

  return null;
};

PermissionControl.displayName = 'PermissionControl';

export default PermissionControl;
