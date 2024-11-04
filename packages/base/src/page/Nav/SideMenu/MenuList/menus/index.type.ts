import { PermissionsConstantType } from '@actiontech/shared/lib/global';
import { ItemType } from 'antd/es/menu/hooks/useItems';

export type CustomMenuItemType =
  | (ItemType & {
      structKey: MenuStructTreeKey;
      permission?: PermissionsConstantType;
    })
  | null;

export type MenuStructTreeType = Array<
  | MenuStructTreeKey
  | {
      type: 'group';
      label: string;
      group: Array<MenuStructTreeKey>;
      permission?: PermissionsConstantType;
    }
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
  | 'permission-group'
  | 'permission-template'
  | 'auth-list'
  | 'data-mask-rule'
  | 'auth-audit'
  | 'template-audit'
  | 'account-management'
  | 'password-management'
  | 'pipeline-configuration'
  | 'version-management'
  | 'data-source-comparison';
