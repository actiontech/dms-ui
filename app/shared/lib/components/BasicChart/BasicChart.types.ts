import { LineConfig, ColumnConfig } from '@ant-design/plots';
import { ChartTypeEnum } from './BasicChart.enum';

export interface BasicChartProps {
  type: ChartTypeEnum;
  loading?: boolean;
  errorInfo?: string | React.ReactNode;
  errorTitle?: string | React.ReactNode;
  config?: LineConfig | ColumnConfig;
  language?: string;
  theme?: string | object;
}
