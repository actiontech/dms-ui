import { useTranslation } from 'react-i18next';
import { Card, Spin } from 'antd';
import { SQLStatisticsWrapper } from './style';
import { useMemo } from 'react';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';

export interface ISQLStatisticsProps {
  loading: boolean;
  errorMessage?: Error;
  data: { SQLTotalNum: number; problemSQlNum: number; optimizedSQLNum: number };
}

const errorDefaultVal = '-';

const SQLStatistics = (props: ISQLStatisticsProps) => {
  const { loading } = props;
  const { t } = useTranslation();

  const { totalNum, problemNum, optimizedNum } = useMemo(() => {
    if (props.errorMessage && !props.loading) {
      return {
        totalNum: errorDefaultVal,
        problemNum: errorDefaultVal,
        optimizedNum: errorDefaultVal
      };
    }
    const { SQLTotalNum, problemSQlNum, optimizedSQLNum } = props.data;
    return {
      totalNum: formatParamsBySeparator(SQLTotalNum),
      problemNum: formatParamsBySeparator(problemSQlNum),
      optimizedNum: formatParamsBySeparator(optimizedSQLNum)
    };
  }, [props]);

  return (
    <SQLStatisticsWrapper>
      <Spin spinning={loading}>
        <Card className="card-wrapper">
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
      </Spin>
    </SQLStatisticsWrapper>
  );
};

export default SQLStatistics;
