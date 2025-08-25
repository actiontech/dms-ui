import { ITotalAnalysis } from '@actiontech/shared/lib/api/sqle/service/common';

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
