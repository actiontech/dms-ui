/**
 * 运维类型 EditableSelect 增/改/删权限开关（AC-B23 / AC-P05 / AC-P06）。
 * 与 dms-kit EditableSelectProps 字段名对齐，供后续 OpsTypeField 直接透传。
 */

export type OpsTypeEditableSelectPermissions = {
  addable: boolean;
  updatable: boolean;
  deletable: boolean;
};

/** 项目管理员及以上：三开 */
export const OPS_TYPE_EDITABLE_PERMISSIONS_ON: OpsTypeEditableSelectPermissions =
  {
    addable: true,
    updatable: true,
    deletable: true
  };

/** 普通成员：三关（仅能选择已有项或留空） */
export const OPS_TYPE_EDITABLE_PERMISSIONS_OFF: OpsTypeEditableSelectPermissions =
  {
    addable: false,
    updatable: false,
    deletable: false
  };

export type ResolveOpsTypeEditablePermissionsInput = {
  /** 平台管理员：任意项目可维护 */
  isAdmin: boolean;
  /** 当前项目是否为项目管理员 */
  isProjectManager: boolean;
};

/**
 * 是否可维护运维类型字典。
 * 平台管理员（任意项目）或当前项目管理员 → true；普通成员 → false。
 */
export const canMaintainOpsTypeDictionary = ({
  isAdmin,
  isProjectManager
}: ResolveOpsTypeEditablePermissionsInput): boolean =>
  isAdmin || isProjectManager;

/**
 * 解析 EditableSelect 的 addable / updatable / deletable。
 * 可维护 → 三开；否则三关（无增改删入口语义）。
 */
export const resolveOpsTypeEditableSelectPermissions = (
  input: ResolveOpsTypeEditablePermissionsInput
): OpsTypeEditableSelectPermissions =>
  canMaintainOpsTypeDictionary(input)
    ? OPS_TYPE_EDITABLE_PERMISSIONS_ON
    : OPS_TYPE_EDITABLE_PERMISSIONS_OFF;
