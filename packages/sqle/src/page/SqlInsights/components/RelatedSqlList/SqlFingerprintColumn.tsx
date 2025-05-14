import { IRelatedSQLInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { Popover } from 'antd';
import { useTranslation } from 'react-i18next';
import SqlExecutionCostTrendChart from './SqlExecutionCostTrendChart';
import HighlightCode from '@actiontech/shared/lib/utils/HighlightCode';

interface SqlFingerprintColumnProps {
  sqlFingerprint: string;
  record: IRelatedSQLInfo;
}

const SqlFingerprintColumn: React.FC<SqlFingerprintColumnProps> = ({
  sqlFingerprint,
  record
}) => {
  const { t } = useTranslation();

  const hasExecutionCostTrend = !!record.execution_cost_trend?.points?.length;

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
      <div
        style={{
          cursor: 'pointer',
          width: '300px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        dangerouslySetInnerHTML={{
          __html: HighlightCode.highlightSql(sqlFingerprint)
        }}
      ></div>
    </Popover>
  );
};

export default SqlFingerprintColumn;
