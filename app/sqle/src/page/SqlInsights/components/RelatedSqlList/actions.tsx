import { ActiontechTableActionMeta } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IRelatedSQLInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../../locale';

export const relatedSqlTableActions: (
  onAnalyzeSql: (record: IRelatedSQLInfo) => void,
  onViewRelatedTransactions: (record: IRelatedSQLInfo) => void
) => ActiontechTableActionMeta<IRelatedSQLInfo>[] = (
  onAnalyzeSql,
  onViewRelatedTransactions
) => {
  return [
    {
      key: 'analyze-sql',
      text: t('sqlInsights.relatedSqlList.actions.analyzeSql'),
      buttonProps: (record) => ({
        onClick: () => onAnalyzeSql(record ?? {})
      })
    },
    {
      key: 'view-related-transactions',
      text: t('sqlInsights.relatedSqlList.actions.viewRelatedTransactions'),
      buttonProps: (record) => ({
        onClick: () => onViewRelatedTransactions(record ?? {})
      })
    }
  ];
};
