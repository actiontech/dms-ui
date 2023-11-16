import { IGetRuleListV1Params } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.d';
import {
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../locale';
export type GetRuleListV1Params = IGetRuleListV1Params & {
  project_name?: string;
  filter_fuzzy_text?: string;
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
      'filter_rule_names',
      {
        filterCustomType: 'select',
        filterKey: ['filter_global_rule_template_name', 'filter_rule_names'],
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
