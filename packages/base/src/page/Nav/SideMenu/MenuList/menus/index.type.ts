import { SystemRole } from '@actiontech/shared/lib/enum';
import { ItemType } from 'antd/es/menu/hooks/useItems';

export type CustomMenuItemType =
  | (ItemType & {
      structKey: MenuStructTreeKey;
      role?: [SystemRole | ''];
    })
  | null;

export type MenuStructTreeType = Array<
  | MenuStructTreeKey
  | { type: 'group'; label: string; group: Array<MenuStructTreeKey> }
  | { type: 'divider' }
>;

export type GenerateMenuItemType = (projectID: string) => CustomMenuItemType;

export type MenuStructTreeKey =
  | 'instance'
  | 'member'
  | 'cloud-beaver'
  | 'data-export'
  | 'project-overview'
  | 'dashboard'
  | 'sql-audit'
  | 'plugin-audit'
  | 'sql-optimization'
  | 'exec-workflow'
  | 'sql-management'
  | 'rule-template'
  | 'whitelist'
  | 'workflow-template'
  | 'sqle-log'
  | 'sql-management-conf'
  | 'push-rule-configuration'
  | 'permission-group'
  | 'permission-template'
  | 'auth-list'
  | 'data-mask-rule'
  | 'auth-audit'
  | 'template-audit'
  | 'account-management'
  | 'password-management';
