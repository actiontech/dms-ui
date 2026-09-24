import { OpPermissionTypeUid } from '@actiontech/shared/lib/enum';

export type UserIdentityLike = {
  name?: string;
  username?: string;
  uid?: string;
  op_permissions?: Array<{ uid?: string } | null> | null;
};

const BUILTIN_ADMIN_NAMES = new Set(['admin', 'sys']);
const BUILTIN_ADMIN_UIDS = new Set(['700200', '700201']);

/** 内置 admin / sys（对齐后端 IsUserDMSAdmin）；禁止用 isAdmin 推断 */
export const isBuiltInAdminUser = (user?: UserIdentityLike | null): boolean => {
  const name = user?.name ?? user?.username ?? '';
  const uid = user?.uid ?? '';
  return BUILTIN_ADMIN_NAMES.has(name) || BUILTIN_ADMIN_UIDS.has(uid);
};

/** 目标用户是否持有系统管理员（700017）；看 op_permissions，不用 is_admin */
export const isSystemAdminUser = (user?: UserIdentityLike | null): boolean => {
  return (
    user?.op_permissions?.some(
      (p) => p?.uid === OpPermissionTypeUid.global_management
    ) ?? false
  );
};

/** 当前操作者能否管理目标用户（管理/删除） */
export const canManageTarget = (
  current?: UserIdentityLike | null,
  target?: UserIdentityLike | null
): boolean => {
  if (isBuiltInAdminUser(current)) {
    return true;
  }
  if (!target) {
    return false;
  }
  return !isBuiltInAdminUser(target) && !isSystemAdminUser(target);
};

/** 当前操作者能否授予/收回「系统管理员」 */
export const canEditGlobalManagement = (
  current?: UserIdentityLike | null
): boolean => isBuiltInAdminUser(current);
