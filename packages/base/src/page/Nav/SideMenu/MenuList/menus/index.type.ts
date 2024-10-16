import { SystemRole } from '@actiontech/shared/lib/enum';
import { ItemType } from 'antd/es/menu/hooks/useItems';

export type CustomMenuItemType =
  | (ItemType & {
      structKey: MenuStructTreeKey;
      role?: Array<SystemRole>;
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
  | 'sql-audit'
  | 'plugin-audit'
  | 'sql-optimization'
  | 'exec-workflow'
  | 'sql-management'
  | 'rule-template'
  | 'whitelist'
  | 'sql-management-exception'
  | 'workflow-template'
  | 'sqle-log'
  | 'sql-management-conf'
  | 'push-rule-configuration'
  | 'pipeline-configuration'
  | 'version-management';
