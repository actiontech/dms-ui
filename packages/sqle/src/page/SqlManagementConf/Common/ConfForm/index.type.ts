import { HighPriorityConditionReqOperatorEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type ScanTypeParams = {
  ruleTemplateName: string;
  markHighPrioritySql: boolean;
  prioritySqlConditions: PrioritySqlConditionsParams;
  [key: string]: string | boolean | PrioritySqlConditionsParams;
};

export type HighPriorityConditionParams = {
  operator: HighPriorityConditionReqOperatorEnum;
  value: string;
  checked: boolean;
};

export type PrioritySqlConditionsParams = Record<
  string,
  HighPriorityConditionParams
>;
export type SqlManagementConfFormFields = {
  environmentTag: string;
  instanceId: string;
  instanceName: string;
  instanceType: string;
  scanTypes: string[];
  [key: string]: string | boolean | string[] | ScanTypeParams;
};

export type FreezingFormFields = Array<keyof SqlManagementConfFormFields>;
