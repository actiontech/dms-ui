import { Radar, RadarConfig } from '@ant-design/plots';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { AnalysisChartWrapper } from './style';
import { ITotalAnalysis } from '@actiontech/shared/lib/api/sqle/service/common';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
interface AnalysisChartProps {
  data?: ITotalAnalysis;
  loading?: boolean;
  errorMessage?: string;
  optimizationStatus?: OptimizationSQLDetailStatusEnum;
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({
  data,
  loading = false,
  errorMessage,
  optimizationStatus
}) => {
  const { t } = useTranslation();

  const radarData = useMemo(() => {
    const transformedData: Array<{
      name: string;
      score: number;
      type: string;
    }> = [];

    data?.detail?.forEach((item: any) => {
      transformedData.push(
        {
          name: item.category,
          score: item.original_score,
          type: t('sqlOptimization.result.original')
        },
        {
          name: item.category,
          score: item.optimized_score,
          type: t('sqlOptimization.result.finalOptimized')
        }
      );
    });

    return transformedData;
  }, [data, t]);

  const config: RadarConfig = {
    data: radarData,
    xField: 'name',
    yField: 'score',
    seriesField: 'type',
    meta: {
      score: {
        // alias: '得分',
        // max: 7,
        range: [0, 1.1]
        // nice: true // 自动调整min max
      }
    },
    xAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineWidth: 1,
            lineDash: null
          }
        }
      },
      label: {
        labelLineWidth: 0,
        labelDirection: 'negative'
      }
    },
    yAxis: {
      line: null,
      label: null
    },
    // 开启面积填充
    area: {
      style: {
        fillOpacity: 0.15
      }
    },

    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `${datum.score}分`
        };
      }
    },
    legend: false,
    smooth: true
  };

  return (
    <AnalysisChartWrapper>
      <ChartWrapper
        loading={loading}
        dataLength={radarData.length}
        errorInfo={errorMessage}
        emptyCont={
          optimizationStatus === OptimizationSQLDetailStatusEnum.optimizing
            ? t('sqlOptimization.result.optimizing')
            : t('common.tip.no_data')
        }
      >
        <Radar {...config} />
      </ChartWrapper>
    </AnalysisChartWrapper>
  );
};

export default AnalysisChart;
