import { ReactNode } from 'react';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export enum RuleStatusEnum {
  disabled,
  enabled
}

export enum EnumActionType {
  edit = 'edit',
  enabled = 'enabled',
  disabled = 'disabled'
}

export type typeActionType =
  | EnumActionType.edit
  | EnumActionType.enabled
  | EnumActionType.disabled;

export type RuleStatusProps = {
  currentRuleStatus?: RuleStatusEnum;
  ruleStatusChange?: (status: RuleStatusEnum) => void;
};

export type RuleListProps = {
  rules?: IRuleResV1[];
  pageHeaderHeight: number;
  isAction?: boolean;
  actionType?: RuleStatusEnum;
  renderDisableNode?: (rule: IRuleResV1) => ReactNode;
  activeDataKeys?: string[];
  onActionHandle?: (record: IRuleResV1, type: typeActionType) => void;
  enableCheckDetail?: boolean;
  tags?: string;
};

export type RuleTypesProps = {
  currentRuleType?: string;
  ruleTypeChange?: (type: string) => void;
  allRulesData: IRuleResV1[]; // 所有的 type 类型
  rules?: IRuleResV1[]; // 当前type类型的有效长度值
};

export type RuleFilterFieldsType = {
  fuzzy_keyword: string;
  operand: string;
  audit_purpose: string;
  audit_accuracy: string;
  sql: string;
  performance_cost: string;
};
