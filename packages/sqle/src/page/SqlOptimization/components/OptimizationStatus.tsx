import { ReactNode } from 'react';
import { t } from '../../../locale';
import { OptimizationStatusStyleWrapper } from '../style';
import { SqlOptimizationStatusEnum } from '../index.data';
import {
  CheckHexagonOutlined,
  AdvancedHexagonFilled,
  InfoHexagonOutlined
} from '@actiontech/icons';

const optimizationStatusMap = () => {
  return new Map<SqlOptimizationStatusEnum, ReactNode>([
    [
      SqlOptimizationStatusEnum.optimizing,
      <>
        <AdvancedHexagonFilled />
        <span>{t('sqlOptimization.status.optimizing')}</span>
      </>
    ],
    [
      SqlOptimizationStatusEnum.finish,
      <>
        <CheckHexagonOutlined />
        <span>{t('sqlOptimization.status.finish')}</span>
      </>
    ],
    [
      SqlOptimizationStatusEnum.failed,
      <>
        <InfoHexagonOutlined />
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
