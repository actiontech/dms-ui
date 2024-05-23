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
  | 'instance-management'
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
  | 'audit-plane'
  | 'rule-template'
  | 'whitelist'
  | 'workflow-template'
  | 'sqle-log';
