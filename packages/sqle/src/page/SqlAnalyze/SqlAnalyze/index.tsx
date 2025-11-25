import { ResultStatusType } from 'antd/es/result';
import SqlAnalyze from './SqlAnalyze';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMeta,
  ITableMetas
} from '@actiontech/shared/lib/api/sqle/service/common';

export type SqlAnalyzeProps = {
  errorMessage: string;
  errorType?: ResultStatusType;
  tableMetas?: ITableMetas;
  sqlExplain?: ISQLExplain;
  performanceStatistics?: IPerformanceStatistics;
  loading?: boolean;
  onCreateSqlOptimizationOrView?: (enable_high_analysis?: boolean) => void;
  onViewOptimizationResult?: () => void;
  optimizationRecordId?: string;
  createSqlOptimizationLoading?: boolean;
  allowSqlOptimization?: boolean;
};

export type ExecPlanParams = Pick<
  SqlAnalyzeProps,
  | 'onCreateSqlOptimizationOrView'
  | 'onViewOptimizationResult'
  | 'optimizationRecordId'
  | 'createSqlOptimizationLoading'
  | 'allowSqlOptimization'
>;

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
