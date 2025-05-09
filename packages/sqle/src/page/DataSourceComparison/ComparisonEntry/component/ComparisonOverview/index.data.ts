import { ObjectDiffResultComparisonResultEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { t } from '../../../../../locale';

type CardMeta = {
  title: string;
  suggestion: string;
};

export const comparisonOverviewDict: Record<
  ObjectDiffResultComparisonResultEnum,
  CardMeta
> = {
  [ObjectDiffResultComparisonResultEnum.comparison_not_exist]: {
    title: t('dataSourceComparison.overview.missingObjects'),
    suggestion: t('dataSourceComparison.overview.needsAction')
  },
  [ObjectDiffResultComparisonResultEnum.base_not_exist]: {
    title: t('dataSourceComparison.overview.newObjects'),
    suggestion: t('dataSourceComparison.overview.needsAction')
  },
  [ObjectDiffResultComparisonResultEnum.inconsistent]: {
    title: t('dataSourceComparison.overview.differentDefinitions'),
    suggestion: t('dataSourceComparison.overview.suggestCheck')
  },
  [ObjectDiffResultComparisonResultEnum.same]: {
    title: t('dataSourceComparison.overview.sameObjects'),
    suggestion: t('dataSourceComparison.overview.noActionNeeded')
  }
};
