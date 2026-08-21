import { useTranslation } from 'react-i18next';
import { Card } from 'antd';
import { SQLStatisticsWrapper } from './style';
import { useMemo } from 'react';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import { BasicToolTips } from '@actiontech/shared';

export interface ISQLStatisticsProps {
  loading: boolean;
  errorMessage?: Error;
  data: {
    SQLTotalNum: number | null;
    problemSQlNum: number | null;
    optimizedSQLNum: number | null;
  };
}

const unsetDefaultVal = '—';

const SQLStatistics = (props: ISQLStatisticsProps) => {
  const { t } = useTranslation();

  const { totalNum, problemNum, optimizedNum } = useMemo(() => {
    const formatOrUnset = (value: number | null) => {
      if (value === null) {
        return unsetDefaultVal;
      }
      return formatParamsBySeparator(value);
    };
    const { SQLTotalNum, problemSQlNum, optimizedSQLNum } = props.data;
    return {
      totalNum: formatOrUnset(SQLTotalNum),
      problemNum: formatOrUnset(problemSQlNum),
      optimizedNum: formatOrUnset(optimizedSQLNum)
    };
  }, [props.data]);

  return (
    <SQLStatisticsWrapper>
      <Card className="card-wrapper">
        <div className="stats-info">
          <BasicToolTips
            title={t('sqlManagement.statistics.filterScopeTips')}
            suffixIcon
          />
        </div>
        <div className="cont-item">
          <strong className="num total">{totalNum}</strong>
          <span className="desc">
            {t('sqlManagement.statistics.SQLTotalNum')}
          </span>
        </div>
        <div className="cont-item">
          <div>
            <strong className="num problem">{problemNum}</strong>
            <span className="desc problemSQlNum">
              {t('sqlManagement.statistics.problemSQlNum')}
            </span>
          </div>
        </div>
        <div className="cont-item">
          <strong className="num optimized">{optimizedNum}</strong>
          <span className="desc">
            {t('sqlManagement.statistics.optimizedSQLNum')}
          </span>
        </div>
      </Card>
    </SQLStatisticsWrapper>
  );
};

export default SQLStatistics;
