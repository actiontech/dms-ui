// @warn/cli/create-dms-page

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

type BaseMenuStructTreeKey =
  | 'instance'
  | 'member'
  | 'cloud-beaver'
  | 'data-export';

type SqleMenuStructTreeKey =
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
  | 'version-management'
  | 'data-source-comparison';

export type MenuStructTreeKey = BaseMenuStructTreeKey | SqleMenuStructTreeKey;
