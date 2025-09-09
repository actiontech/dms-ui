import { Radar, RadarConfig } from '@ant-design/plots';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { AnalysisChartWrapper } from './style';
import {
  ITotalAnalysis,
  IAnalysisDetail
} from '@actiontech/shared/lib/api/sqle/service/common';

interface AnalysisChartProps {
  data?: ITotalAnalysis;
  loading?: boolean;
  errorMessage?: string;
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({
  data,
  loading = false,
  errorMessage
}) => {
  const { t } = useTranslation();

  const radarData = useMemo(() => {
    const transformedData: Array<{
      name: string;
      score: number;
      type: string;
    }> = [];

    data?.detail?.forEach((item: IAnalysisDetail) => {
      transformedData.push(
        {
          name: item.category ?? '',
          score: item.original_score ?? 0,
          type: t('sqlOptimization.result.original')
        },
        {
          name: item.category ?? '',
          score: item.optimized_score ?? 0,
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
      formatter: (datum) => {
        return {
          name: datum?.type ?? '',
          value: `${datum?.score ?? 0}分`
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
      >
        <Radar {...config} />
      </ChartWrapper>
    </AnalysisChartWrapper>
  );
};

export default AnalysisChart;
