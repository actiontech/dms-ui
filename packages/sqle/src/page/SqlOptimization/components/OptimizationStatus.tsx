import { ReactNode } from 'react';
import { t } from '../../../locale';
import {
  IconWorkflowStatusIsExecuting,
  IconWorkflowStatusIsFailed,
  IconWorkflowStatusIsFinished
} from '../../../icon/SqlExecWorkflow';
import { OptimizationStatusStyleWrapper } from '../style';
import { SqlOptimizationStatusEnum } from '../index.data';

const optimizationStatusMap = () => {
  return new Map<SqlOptimizationStatusEnum, ReactNode>([
    [
      SqlOptimizationStatusEnum.optimizing,
      <>
        <IconWorkflowStatusIsExecuting />
        <span>{t('sqlOptimization.status.optimizing')}</span>
      </>
    ],
    [
      SqlOptimizationStatusEnum.finish,
      <>
        <IconWorkflowStatusIsFinished />
        <span>{t('sqlOptimization.status.finish')}</span>
      </>
    ],
    [
      SqlOptimizationStatusEnum.failed,
      <>
        <IconWorkflowStatusIsFailed />
        <span>{t('sqlOptimization.status.failed')}</span>
      </>
    ]
  ]);
};

const OptimizationStatus: React.FC<{
  status: SqlOptimizationStatusEnum;
}> = ({ status }) => {
  return (
    <OptimizationStatusStyleWrapper>
      {optimizationStatusMap().get(status)}
    </OptimizationStatusStyleWrapper>
  );
};

export default OptimizationStatus;
