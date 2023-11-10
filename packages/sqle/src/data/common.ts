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

export const SQLE_INSTANCE_SOURCE_NAME = 'SQLE';

export const SQLE_REDIRECT_KEY_PARAMS_NAME = 'target';

export const SQLE_COOKIE_TOKEN_KEY_NAME = 'sqle-token';

export const OPEN_CLOUD_BEAVER_URL_PARAM_NAME = 'open_cloud_beaver';
