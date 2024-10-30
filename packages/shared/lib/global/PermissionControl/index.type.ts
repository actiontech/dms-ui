import { ReactNode } from 'react';
import { PermissionsConstantType } from '../usePermission';

export type PermissionControlProps = {
  permission: PermissionsConstantType;
  children: ReactNode;
  projectID?: string;
};
