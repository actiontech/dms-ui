import { ReactNode } from 'react';
import { t } from '../../../locale';
import { OptimizationStatusStyleWrapper } from '../style';
import { OptimizationRecordStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  IconOrderStatusIsExecuting,
  IconOrderStatusIsFailed,
  IconOrderStatusIsFinished
} from '../../../icon/Order';

const optimizationStatusMap = () => {
  return new Map<OptimizationRecordStatusEnum, ReactNode>([
    [
      OptimizationRecordStatusEnum.optimizing,
      <>
        <IconOrderStatusIsExecuting />
        <span>{t('sqlOptimization.status.optimizing')}</span>
      </>
    ],
    [
      OptimizationRecordStatusEnum.finish,
      <>
        <IconOrderStatusIsFinished />
        <span>{t('sqlOptimization.status.finish')}</span>
      </>
    ],
    [
      OptimizationRecordStatusEnum.failed,
      <>
        <IconOrderStatusIsFailed />
        <span>{t('sqlOptimization.status.failed')}</span>
      </>
    ]
  ]);
};

const OptimizationStatus: React.FC<{
  status: OptimizationRecordStatusEnum;
}> = ({ status }) => {
  return (
    <OptimizationStatusStyleWrapper>
      {optimizationStatusMap().get(status)}
    </OptimizationStatusStyleWrapper>
  );
};

export default OptimizationStatus;
