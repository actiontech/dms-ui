import { IFilterTip } from '@actiontech/shared/lib/api/sqle/service/common';
import { groupBy } from 'lodash';

/** 动态枚举：进页不预填，点开下拉才拉 filter_tips（AC-006 schema/user；AC-007 rule_name） */
export const LAZY_TIP_FILTER_NAMES = new Set([
  'schema_name',
  'db_user',
  'rule_name'
]);

export const isLazyTipFilter = (filterName?: string) =>
  !!filterName && LAZY_TIP_FILTER_NAMES.has(filterName);

export const filterTipsToSelectOptions = (filterTips?: IFilterTip[]) => {
  if (!filterTips?.length) {
    return [];
  }
  const filterTipsGroupDictionary = groupBy(filterTips, 'group');
  return Object.keys(filterTipsGroupDictionary)
    .map((group) => {
      const tips = filterTipsGroupDictionary[group];
      if (group) {
        return {
          label: group,
          options: tips.map((v) => ({
            label: v.desc,
            value: v.value
          }))
        };
      }
      return tips.map((v) => ({ label: v.desc, value: v.value }));
    })
    .flat();
};
