import { ITotalAnalysis } from '@actiontech/shared/lib/api/sqle/service/common';
import useOptimizationResult from './hooks/useOptimizationResult';

export enum OptimizationResultStatus {
  RESOLVED = 'resolved',
  FAILED = 'failed'
}

export enum ExecutionPlanType {
  ORIGINAL = 'original',
  OPTIMIZED = 'optimized'
}

export interface ProbabilityDisplayProps {
  analysis?: ITotalAnalysis;
  resultStatus?: OptimizationResultStatus;
}

export interface SqlOptimizationResultProps
  extends Omit<
    ReturnType<typeof useOptimizationResult>,
    'getOptimizationResult' | 'cancelOptimizationRequestPolling'
  > {
  isVerticalLayout?: boolean;
}
