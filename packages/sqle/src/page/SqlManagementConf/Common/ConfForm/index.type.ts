import { HighPriorityConditionReqBooleanOperatorEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type ScanTypeParams = {
  ruleTemplateName: string;
  markHighPrioritySql: boolean;
  prioritySqlConditions: PrioritySqlConditionsParams;
  [key: string]: string | boolean | PrioritySqlConditionsParams;
};

export type HighPriorityConditionParams = {
  booleanOperator: HighPriorityConditionReqBooleanOperatorEnum;
  value: string;
  checked: boolean;
};

export type PrioritySqlConditionsParams = Record<
  string,
  HighPriorityConditionParams
>;
export type SqlManagementConfFormFields = {
  businessScope: string;
  instanceId: string;
  instanceName: string;
  instanceType: string;
  scanTypes: string[];
  [key: string]: string | boolean | string[] | ScanTypeParams;
};

export type FreezingFormFields = Array<keyof SqlManagementConfFormFields>;
