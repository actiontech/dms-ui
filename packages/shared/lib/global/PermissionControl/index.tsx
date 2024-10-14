import usePermission from '../usePermission/usePermission';
import { PermissionControlProps } from './index.type';

const PermissionControl: React.FC<PermissionControlProps> = ({
  permission,
  children
}) => {
  const { checkActionPermission } = usePermission();

  if (checkActionPermission(permission)) {
    return <>{children}</>;
  }

  return null;
};

PermissionControl.displayName = 'PermissionControl';

export default PermissionControl;
