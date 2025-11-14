import React from 'react';
import { Space } from 'antd';
import ProbabilityDisplay from './ProbabilityDisplay';
import AnalysisChart from './AnalysisChart';
import OptimizeSteps from './OptimizeSteps';
import { SqlOptimizationRightContentWrapper } from './style';
import {
  ITotalAnalysis,
  IOptimizeStep
} from '@actiontech/shared/lib/api/sqle/service/common';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { EmptyBox } from '@actiontech/dms-kit';
import BestPerformanceIcon from './BestPerformanceIcon';
import { useTranslation } from 'react-i18next';

export interface RightContentProps {
  isVerticalLayout?: boolean;
  totalAnalysis?: ITotalAnalysis;
  optimizeSteps: IOptimizeStep[];
  errorMessage?: string;
  onOptimizationRuleClick: (stepIndex: number) => void;
  optimizationStatus?: OptimizationSQLDetailStatusEnum;
}

const RightContent: React.FC<RightContentProps> = ({
  isVerticalLayout = false,
  totalAnalysis,
  optimizeSteps,
  errorMessage,
  onOptimizationRuleClick,
  optimizationStatus
}) => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();

  return (
    <SqlOptimizationRightContentWrapper
      span={isVerticalLayout ? 24 : 8}
      style={{ background: sqleTheme.sqlOptimization.rightContentBackground }}
    >
      <Space direction="vertical" size={16}>
        <ProbabilityDisplay
          analysis={totalAnalysis}
          optimizationStatus={optimizationStatus}
        />
        <div className="analysis-chart">
          <EmptyBox
            if={
              !totalAnalysis?.detail?.length &&
              optimizationStatus === OptimizationSQLDetailStatusEnum.finish
            }
            defaultNode={
              <AnalysisChart
                data={totalAnalysis}
                errorMessage={errorMessage}
                optimizationStatus={optimizationStatus}
              />
            }
          >
            <BestPerformanceIcon width={60} height={60} />
            <span>{t('sqlOptimization.result.sqlQueryAlreadyOptimal')}</span>
          </EmptyBox>
        </div>
        <EmptyBox if={!!optimizeSteps.length}>
          <OptimizeSteps
            optimizeSteps={optimizeSteps}
            onOptimizationRuleClick={onOptimizationRuleClick}
            errorMessage={errorMessage}
            optimizationStatus={optimizationStatus}
          />
        </EmptyBox>
      </Space>
    </SqlOptimizationRightContentWrapper>
  );
};

export default RightContent;
