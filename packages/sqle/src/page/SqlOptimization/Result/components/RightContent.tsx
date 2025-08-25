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
import { OptimizationResultStatus } from '../index.type';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';

export interface RightContentProps {
  isVerticalLayout?: boolean;
  totalAnalysis?: ITotalAnalysis;
  optimizationResultStatus?: OptimizationResultStatus;
  optimizeSteps: IOptimizeStep[];
  errorMessage?: string;
  onOptimizationRuleClick: (stepIndex: number) => void;
}

const RightContent: React.FC<RightContentProps> = ({
  isVerticalLayout = false,
  totalAnalysis,
  optimizationResultStatus,
  optimizeSteps,
  errorMessage,
  onOptimizationRuleClick
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
          resultStatus={optimizationResultStatus}
        />
        <div className="analysis-chart">
          <AnalysisChart data={totalAnalysis} errorMessage={errorMessage} />
        </div>
        <OptimizeSteps
          optimizeSteps={optimizeSteps}
          onOptimizationRuleClick={onOptimizationRuleClick}
          errorMessage={errorMessage}
        />
      </Space>
    </SqlOptimizationRightContentWrapper>
  );
};

export default RightContent;
