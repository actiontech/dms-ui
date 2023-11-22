import {
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../locale';
export type GetRuleListV1Params = {
  project_name?: string;
  filter_fuzzy_text?: string;
  filter_rule_template?: string;
  filter_db_type?: string;
};

export const RuleFilterContainerMeta: () => ActiontechTableFilterMeta<
  GetRuleListV1Params,
  GetRuleListV1Params
> = () => {
  return new Map<
    keyof GetRuleListV1Params,
    ActiontechTableFilterMetaValue<GetRuleListV1Params>
  >([
    [
      'filter_fuzzy_text',
      {
        filterCustomType: 'search-input',
        filterKey: 'filter_fuzzy_text',
        checked: true
      }
    ],
    [
      'project_name',
      {
        filterCustomType: 'select',
        filterKey: 'project_name',
        filterLabel: t('rule.form.project'),
        checked: true
      }
    ],
    [
      'filter_rule_template',
      {
        filterCustomType: 'select',
        filterKey: 'filter_rule_template',
        filterLabel: t('rule.form.ruleTemplate'),
        checked: true
      }
    ],
    [
      'filter_db_type',
      {
        filterCustomType: 'select',
        filterKey: 'filter_db_type',
        filterLabel: t('rule.form.dbType'),
        checked: true
      }
    ]
  ]);
};
