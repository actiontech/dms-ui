import { GetSqlPerformanceInsightsRelatedSQLFilterSourceEnum } from '@actiontech/shared/lib/api/sqle/service/SqlInsight/index.enum';
import { t } from '../../../../locale';

export const RelatedSqlFilterSourceOptions = [
  {
    label: t('sqlInsights.relatedSqlList.source.order'),
    value: GetSqlPerformanceInsightsRelatedSQLFilterSourceEnum.workflow
  },
  {
    label: t('sqlInsights.relatedSqlList.source.sqlManage'),
    value: GetSqlPerformanceInsightsRelatedSQLFilterSourceEnum.sql_manage
  },
  {
    label: t('sqlInsights.relatedSqlList.source.workbench'),
    value: GetSqlPerformanceInsightsRelatedSQLFilterSourceEnum.workbench
  }
];
