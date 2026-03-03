import { ITopProblemDistribution } from '@actiontech/shared/lib/api/sqle/service/common.d';
import { Bar, BarConfig, G2 } from '@ant-design/plots';
import { EmptyBox } from '@actiontech/dms-kit';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useThemeStyleData from '../../../../../../../hooks/useThemeStyleData';
import { TopProblemDistributionStyleWrapper } from './style';

interface TopProblemDistributionProps {
  data: ITopProblemDistribution[];
}

const LABEL_MAX_LENGTH = 15;
const BAR_WIDTH = 8;
const BAR_ITEM_HEIGHT = 45;

const formatLabelWithEllipsis = (text: string) => {
  if (text.length <= LABEL_MAX_LENGTH) return text;
  return `${text.slice(0, LABEL_MAX_LENGTH)}...`;
};

const TopProblemDistribution: React.FC<TopProblemDistributionProps> = ({
  data
}) => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const element = chartContainerRef.current;
    if (!element) return;
    const updateWidth = () => setChartWidth(element.clientWidth);

    updateWidth();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(element);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const chartData = data.map((item) => ({
    type: item.problem_type || '',
    value: item.percentage ?? 0
  }));
  const maxValue = Math.max(...chartData.map((item) => item.value), 0);
  const chartHeight = chartData.length * BAR_ITEM_HEIGHT;
  const chartKey = chartData
    .map((item) => `${item.type}:${item.value}`)
    .join('|');

  const config: BarConfig = {
    data: chartData,
    xField: 'value',
    yField: 'type',
    seriesField: 'type',
    legend: false,
    yAxis: false,
    xAxis: false,
    appendPadding: [10, 10, 0, 0],
    height: chartHeight,
    meta: {
      value: {
        min: 0,
        max: maxValue
      }
    },
    minBarWidth: BAR_WIDTH,
    maxBarWidth: BAR_WIDTH,
    barBackground: {
      style: {
        fill: sqleTheme.reportStatistics.ManagementView.topProblemDistribution
          .barBackgroundColor,
        fillOpacity: 1
      }
    },
    tooltip: {
      showTitle: false,
      fields: ['type', 'value'],
      formatter: (datum) => {
        const item = datum as { type: string; value: number };
        return {
          name: item.type,
          value: `${item.value}%`
        };
      }
    },
    label: {
      position: 'left',
      offsetX: 0,
      offsetY: -12,
      content: (datum, mappingData) => {
        const item = datum as { type: string; value: number };
        const CanvasGroup = G2.getEngine('canvas')?.Group;
        const valueX = Math.max(chartWidth - 24, 0);
        if (!CanvasGroup) {
          return `${formatLabelWithEllipsis(item.type)} ${item.value}%`;
        }
        const group = new CanvasGroup({});
        const dotColor =
          (mappingData as { color?: string } | undefined)?.color ||
          sqleTheme.reportStatistics.ManagementView.topProblemDistribution
            .labelColor;
        const dotRadius = 3;

        group.addShape('circle', {
          attrs: {
            x: -6,
            y: 6,
            r: dotRadius,
            fill: dotColor
          }
        });

        group.addShape('text', {
          attrs: {
            x: 0,
            y: 6,
            text: formatLabelWithEllipsis(item.type),
            textAlign: 'left',
            textBaseline: 'middle',
            fill: sqleTheme.reportStatistics.ManagementView
              .topProblemDistribution.labelColor,
            fontSize: 12
          }
        });

        group.addShape('text', {
          attrs: {
            x: valueX,
            y: 6,
            text: `${item.value}%`,
            textAlign: 'right',
            textBaseline: 'middle',
            fill: sqleTheme.reportStatistics.ManagementView
              .topProblemDistribution.labelColor,
            fontSize: 12
          }
        });

        return group;
      }
    }
  };

  return (
    <TopProblemDistributionStyleWrapper>
      <EmptyBox
        if={data.length > 0}
        defaultNode={
          <div className="top-problem-distribution-empty">
            {t('common.tip.no_data')}
          </div>
        }
      >
        <div ref={chartContainerRef}>
          <Bar key={chartKey} {...config} />
        </div>
      </EmptyBox>
    </TopProblemDistributionStyleWrapper>
  );
};

export default TopProblemDistribution;
