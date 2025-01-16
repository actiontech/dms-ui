import { ResultStatusType } from 'antd/es/result';
import SqlAnalyze from './SqlAnalyze';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMeta,
  ITableMetas,
  IChartPoint
} from '@actiontech/shared/lib/api/sqle/service/common';
import { Dayjs } from 'dayjs';

export type SqlAnalyzeProps = {
  errorMessage: string;
  errorType?: ResultStatusType;
  tableMetas?: ITableMetas;
  sqlExplain?: ISQLExplain;
  performanceStatistics?: IPerformanceStatistics;
  loading?: boolean;
  sqlExecPlanCostDataSource?: IChartPoint[];
  getSqlExecPlanCostDataSourceLoading?: boolean;
  getSqlExecPlanCostDataSourceError?: string;
  getSqlExecPlanCostDataSource?: (startTime?: Dayjs, endTime?: Dayjs) => void;
  showExecPlanCostChart?: boolean;
};

export type ExecPlanParams = Pick<
  SqlAnalyzeProps,
  | 'getSqlExecPlanCostDataSource'
  | 'getSqlExecPlanCostDataSourceLoading'
  | 'sqlExecPlanCostDataSource'
  | 'showExecPlanCostChart'
  | 'getSqlExecPlanCostDataSourceError'
>;

export type ExecPlanCostChartProps = {
  setHistoryExecPlan: (data: IChartPoint) => void;
} & Omit<ExecPlanParams, 'showExecPlanCostChart'>;

export type UseTableSchemaOption = {
  schemaName?: string;
  dataSourceName?: string;
};

export type TableSchemaItem = {
  tableMeta: ITableMeta;
  id: string;
  errorMessage: string;
};

export default SqlAnalyze;
