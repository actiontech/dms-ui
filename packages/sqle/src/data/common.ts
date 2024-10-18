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

export const SqlFiledInitialValue = '/* input your sql */';

export const SOURCE_WORKFLOW_PATH_KEY = 'sourceWorkflowId';

export const WORKFLOW_VERSION_NAME_PATH_KEY = 'versionName';

export const WORKFLOW_VERSION_ID_PATH_KEY = 'versionId';

export const SQL_MANAGEMENT_INSTANCE_PATH_KEY = 'instanceId';

export const SQL_MANAGEMENT_SOURCE_PATH_KEY = 'source';
