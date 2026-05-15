import { ReactNode } from 'react';
import { PermissionsConstantType } from '../usePermission';

export type PermissionControlProps = {
  permission: PermissionsConstantType;
  children: ReactNode;
  projectID?: string;
  authDataSourceId?: string;
  /**
   * When true, skip the BWP (Business Write Permission) disabled check
   * inside PermissionControl. Use this when the caller already handles
   * BWP logic with additional context (e.g., workflow assignee membership)
   * and passes the correct `disabled` prop directly to the child.
   */
  skipBWPCheck?: boolean;
};
