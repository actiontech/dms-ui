import { IGetCustomRulesV1Params } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.d';
import {
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../locale';

export const CustomRuleFilterContainerMeta: () => ActiontechTableFilterMeta<
  IGetCustomRulesV1Params,
  IGetCustomRulesV1Params
> = () => {
  return new Map<
    keyof IGetCustomRulesV1Params,
    ActiontechTableFilterMetaValue<IGetCustomRulesV1Params>
  >([
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
