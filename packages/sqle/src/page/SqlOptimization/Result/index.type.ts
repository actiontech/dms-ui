import { ITotalAnalysis } from '@actiontech/shared/lib/api/sqle/service/common';
import useOptimizationResult from './hooks/useOptimizationResult';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export enum ExecutionPlanType {
  ORIGINAL = 'original',
  OPTIMIZED = 'optimized'
}

export interface ProbabilityDisplayProps {
  analysis?: ITotalAnalysis;
  optimizationStatus?: OptimizationSQLDetailStatusEnum;
}

export interface SqlOptimizationResultProps
  extends Omit<
    ReturnType<typeof useOptimizationResult>,
    'getOptimizationResult' | 'cancelOptimizationRequestPolling'
  > {
  isVerticalLayout?: boolean;
}
