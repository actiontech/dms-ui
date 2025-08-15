import { Radar, RadarConfig } from '@ant-design/plots';
import ChartWrapper from '../../../../components/ChartCom/ChartWrapper';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

interface AnalysisChartProps {
  data?: any;
  loading?: boolean;
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({
  data,
  loading = false
}) => {
  const { t } = useTranslation();

  // 转换数据格式为雷达图所需的格式
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
          type: '原始SQL'
        },
        {
          name: item.category,
          score: item.optimized_score,
          type: '优化SQL'
        }
      );
    });

    return transformedData;
  }, [data]);

  // todo 不支持如Echarts的indicator来配置每一项的最大值
  const config: RadarConfig = {
    data: radarData,
    xField: 'name',
    yField: 'score',
    seriesField: 'type',
    meta: {
      score: {
        alias: '得分',
        max: 7,
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
            stroke: '#f0f0f0',
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
    <div style={{ height: 250, backgroundColor: '#ffffff', padding: 16 }}>
      <ChartWrapper
        loading={loading}
        dataLength={radarData.length}
        errorInfo={null}
        emptyCont={t('common.noData')}
      >
        <Radar {...config} />
      </ChartWrapper>
    </div>
  );
};

export default AnalysisChart;
