export {
  ResponseCode,
  CharCode,
  SystemRole,
  ModalSize
} from '@actiontech/shared/lib/enum';

export {
  ModalFormLayout,
  PageBigFormLayout,
  PageFormLayout,
  filterFormButtonLayoutFactory,
  FilterFormColLayout,
  FilterFormLayout,
  FilterFormRowLayout
} from '@actiontech/shared/lib/data/common';

export const RuleListDefaultTabKey = 'ALL';
export const instanceListDefaultKey = 'all';
export const ruleTemplateListDefaultKey = 'all';

export enum LoginTypeEnum {
  'ldap' = 'ldap',
  'sqle' = 'sqle'
}

export enum ManagementPermissionsEnum {
  Create_Project = 1
}

export const SQLE_INSTANCE_SOURCE_NAME = 'SQLE';
