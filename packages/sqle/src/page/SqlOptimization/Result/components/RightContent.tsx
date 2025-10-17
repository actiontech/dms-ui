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
          <AnalysisChart
            data={totalAnalysis}
            errorMessage={errorMessage}
            optimizationStatus={optimizationStatus}
          />
        </div>
        <OptimizeSteps
          optimizeSteps={optimizeSteps}
          onOptimizationRuleClick={onOptimizationRuleClick}
          errorMessage={errorMessage}
          optimizationStatus={optimizationStatus}
        />
      </Space>
    </SqlOptimizationRightContentWrapper>
  );
};

export default RightContent;
