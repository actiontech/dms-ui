import { IFilterTip } from '@actiontech/shared/lib/api/sqle/service/common';
import { groupBy } from 'lodash';

/** 动态枚举：进页不预填，点开下拉才拉 filter_tips（AC-006 schema/user；AC-007 rule_name） */
export const LAZY_TIP_FILTER_NAMES = new Set([
  'schema_name',
  'db_user',
  'rule_name'
]);

export const RULE_NAME_FILTER = 'rule_name';

export const isLazyTipFilter = (filterName?: string) =>
  !!filterName && LAZY_TIP_FILTER_NAMES.has(filterName);

export const isRuleNameFilter = (filterName?: string) =>
  filterName === RULE_NAME_FILTER;

export type RuleTipClientFilter = {
  level?: string;
  keyword?: string;
};

/** 规则 tip：仅前端按等级 / 关键字筛已返回数据，不再打接口 */
export const filterRuleTipsClientSide = (
  tips: IFilterTip[] | undefined,
  { level, keyword }: RuleTipClientFilter
): IFilterTip[] => {
  if (!tips?.length) {
    return [];
  }
  const normalizedKeyword = keyword?.trim().toLowerCase() ?? '';
  return tips.filter((tip) => {
    if (level && tip.level !== level) {
      return false;
    }
    if (!normalizedKeyword) {
      return true;
    }
    const haystack = `${tip.desc ?? ''} ${tip.value ?? ''}`.toLowerCase();
    return haystack.includes(normalizedKeyword);
  });
};

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
