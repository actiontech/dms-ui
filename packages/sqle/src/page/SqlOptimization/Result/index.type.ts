import { OptimizationResultStatus } from './index.data';
import { ITotalAnalysis } from '@actiontech/shared/lib/api/sqle/service/common';

export interface ProbabilityDisplayProps {
  analysis?: ITotalAnalysis;
  resultStatus: OptimizationResultStatus;
}
