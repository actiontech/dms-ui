import { useMemo } from 'react';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import {
  resolveOpsTypeEditableSelectPermissions,
  type OpsTypeEditableSelectPermissions
} from './permissions';

/**
 * 按当前用户 + 项目解析运维类型 EditableSelect 权限开关。
 * 后续 OpsTypeField：`const { addable, updatable, deletable } = useOpsTypeEditablePermissions(projectName)`
 */
const useOpsTypeEditablePermissions = (
  projectName?: string
): OpsTypeEditableSelectPermissions => {
  const { isAdmin, isProjectManager } = useCurrentUser();

  return useMemo(
    () =>
      resolveOpsTypeEditableSelectPermissions({
        isAdmin,
        isProjectManager: !!projectName && isProjectManager(projectName)
      }),
    [isAdmin, isProjectManager, projectName]
  );
};

export default useOpsTypeEditablePermissions;
