import { IBindProject } from '../../../../base/src/store/user';
import { FormInstance } from 'antd';

export type RuleListFilterForm = {
  filter_fuzzy_text: string;
  project_name: string;
  filter_rule_template: string;
  filter_db_type: string;
};

export type RuleListFilterProps = {
  form: FormInstance<RuleListFilterForm>;
  getTemplateRules: (
    projectName?: string | undefined,
    ruleTemplateName?: string | undefined,
    fuzzyKeyword?: string | undefined
  ) => void;
  setShowNorRuleTemplatePage: (v: boolean) => void;
  bindProjects: IBindProject[];
  getAllRules: () => void;
};
