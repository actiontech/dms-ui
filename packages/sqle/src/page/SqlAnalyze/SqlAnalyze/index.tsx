import { ResultStatusType } from 'antd/es/result';
import SqlAnalyze from './SqlAnalyze';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMeta,
  ITableMetas,
  IChartPoint
} from '@actiontech/shared/lib/api/sqle/service/common';
import { getSqlExecPlanCostDataSourceParams } from '../hooks/useSqlExecPlanCost';
import { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction } from 'react';

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
  getSqlExecPlanCostDataSource?: (
    params: getSqlExecPlanCostDataSourceParams
  ) => void;
  showExecPlanCostChart?: boolean;
  initTime?: Dayjs;
  selectedPoint?: Array<IChartPoint | undefined>;
  setSelectedPoint?: Dispatch<SetStateAction<(IChartPoint | undefined)[]>>;
  onCreateSqlOptimization?: (enable_high_analysis?: boolean) => void;
  onViewOptimizationResult?: () => void;
  optimizationRecordId?: string;
  createSqlOptimizationLoading?: boolean;
  allowSqlOptimization?: boolean;
  getPerformanceStatistics?: () => void;
  isPerformanceInfoLoaded?: boolean;
};

export type ExecPlanParams = Pick<
  SqlAnalyzeProps,
  | 'getSqlExecPlanCostDataSource'
  | 'getSqlExecPlanCostDataSourceLoading'
  | 'sqlExecPlanCostDataSource'
  | 'showExecPlanCostChart'
  | 'getSqlExecPlanCostDataSourceError'
  | 'initTime'
  | 'selectedPoint'
  | 'setSelectedPoint'
  | 'onCreateSqlOptimization'
  | 'onViewOptimizationResult'
  | 'optimizationRecordId'
  | 'createSqlOptimizationLoading'
  | 'allowSqlOptimization'
  | 'getPerformanceStatistics'
  | 'isPerformanceInfoLoaded'
>;

export type ExecPlanCostChartProps = {
  onScrollIntoView: () => void;
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
