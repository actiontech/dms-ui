import { IBindProject } from '../../../../base/src/store/user';
import { FormInstance } from 'antd';

export type RuleListFilterForm = {
  fuzzy_keyword: string;
  project_name: string;
  filter_rule_template: string;
  filter_db_type: string;
  operand: string;
  audit_purpose: string;
  audit_accuracy: string;
  sql: string;
  filter_rule_version: number;
  performance_cost: string;
};

export type RuleListFilterFormKey = keyof RuleListFilterForm;

export type RuleListFilterProps = {
  form: FormInstance<RuleListFilterForm>;
  visible: boolean;
  bindProjects: IBindProject[];
  setShowNorRuleTemplatePage: (v: boolean) => void;
};
