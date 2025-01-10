// @warn/cli/create-dms-page

import { PermissionsConstantType } from '@actiontech/shared/lib/global';
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems';
import { I18nKey } from '../../../../../locale';
import { ReactNode } from 'react';
import { To } from 'react-router-dom';

export type CustomMenuItemType =
  | (ItemType<MenuItemType> &
      Pick<MenuItemI18nConfig, 'structKey' | 'permission'>)
  | null;

export type GenerateMenuItemI18nConfig = (
  projectID: string
) => MenuItemI18nConfig;

export interface MenuItemI18nConfig {
  to: To;
  label: I18nKey;
  icon: ReactNode;
  key: string;
  structKey: MenuTreeKey;
  permission?: PermissionsConstantType;
}

export interface MenuItemTranslatedConfig
  extends Omit<MenuItemI18nConfig, 'label'> {
  label: ReactNode;
}

interface MenuTreeGroupI18n {
  type: 'group';
  groupLabelKey: I18nKey;
  groups: Array<MenuTreeKey>;
  permission?: PermissionsConstantType;
}

interface MenuTreeGroupTranslated
  extends Omit<MenuTreeGroupI18n, 'groupLabelKey'> {
  label: string;
}

interface MenuTreeDivider {
  type: 'divider';
}
export type MenuTreeKey = BaseMenuStructTreeKey | SqleMenuStructTreeKey;
export type MenuTreeI18n = MenuTreeKey | MenuTreeGroupI18n | MenuTreeDivider;
export type MenuTreeTranslated =
  | MenuTreeKey
  | MenuTreeGroupTranslated
  | MenuTreeDivider;

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
