import { IRelatedSQLInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { Popover } from 'antd';
import { useTranslation } from 'react-i18next';
import SqlExecutionCostTrendChart from './SqlExecutionCostTrendChart';
import { SQLRenderer } from '@actiontech/shared/lib/';

interface SqlFingerprintColumnProps {
  sqlFingerprint: string;
  record: IRelatedSQLInfo;
}

const SqlFingerprintColumn: React.FC<SqlFingerprintColumnProps> = ({
  sqlFingerprint,
  record
}) => {
  const { t } = useTranslation();

  const hasExecutionCostTrend = !!record.execution_time_trend?.points?.length;

  return (
    <Popover
      content={
        hasExecutionCostTrend ? (
          <SqlExecutionCostTrendChart record={record} />
        ) : (
          t('sqlInsights.relatedSqlList.noExecutionCostTrend')
        )
      }
      title={t('sqlInsights.relatedSqlList.sqlFingerprintDetail.title')}
      placement="topLeft"
    >
      <SQLRenderer.Snippet
        sql={sqlFingerprint}
        rows={1}
        tooltip={false}
        cuttingLength={200}
      />
    </Popover>
  );
};

export default SqlFingerprintColumn;
