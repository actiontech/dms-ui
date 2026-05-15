import { ReactNode } from 'react';
import { t } from '../../../locale';
import { OptimizationStatusStyleWrapper } from '../style';
import {
  CheckHexagonOutlined,
  AdvancedHexagonFilled,
  InfoHexagonOutlined
} from '@actiontech/icons';
import { OptimizationRecordStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const optimizationStatusMap = () => {
  return new Map<OptimizationRecordStatusEnum, ReactNode>([
    [
      OptimizationRecordStatusEnum.optimizing,
      <>
        <AdvancedHexagonFilled />
        <span>{t('sqlOptimization.status.optimizing')}</span>
      </>
    ],
    [
      OptimizationRecordStatusEnum.finish,
      <>
        <CheckHexagonOutlined />
        <span>{t('sqlOptimization.status.finish')}</span>
      </>
    ],
    [
      OptimizationRecordStatusEnum.failed,
      <>
        <InfoHexagonOutlined />
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
