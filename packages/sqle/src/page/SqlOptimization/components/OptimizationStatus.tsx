import { ReactNode } from 'react';
import { t } from '../../../locale';
import {
  IconOrderStatusIsExecuting,
  IconOrderStatusIsFailed,
  IconOrderStatusIsFinished
} from '../../../icon/Order';
import { OptimizationStatusStyleWrapper } from '../style';
import { SqlOptimizationStatusEnum } from '../index.data';

const optimizationStatusMap = () => {
  return new Map<SqlOptimizationStatusEnum, ReactNode>([
    [
      SqlOptimizationStatusEnum.optimizing,
      <>
        <IconOrderStatusIsExecuting />
        <span>{t('sqlOptimization.status.optimizing')}</span>
      </>
    ],
    [
      SqlOptimizationStatusEnum.finish,
      <>
        <IconOrderStatusIsFinished />
        <span>{t('sqlOptimization.status.finish')}</span>
      </>
    ],
    [
      SqlOptimizationStatusEnum.failed,
      <>
        <IconOrderStatusIsFailed />
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
