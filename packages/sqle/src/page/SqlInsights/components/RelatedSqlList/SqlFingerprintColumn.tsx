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
      {/* todo 因为Snippet本身被tooltip包裹，所以这里需要使用div包裹，否则外层的Popover会失效 */}
      <div>
        <SQLRenderer.Snippet
          sql={sqlFingerprint}
          rows={1}
          tooltip={false}
          cuttingLength={200}
        />
      </div>
    </Popover>
  );
};

export default SqlFingerprintColumn;
