import React from 'react';
import { Space, Divider } from 'antd';
import ProbabilityDisplay from './ProbabilityDisplay';
import AnalysisChart from './AnalysisChart';
import OptimizeSteps from './OptimizeSteps';
import { SqlOptimizationRightContentWrapper } from './style';
import {
  ITotalAnalysis,
  IOptimizeStep,
  IOptimizedSQLFeedback
} from '@actiontech/shared/lib/api/sqle/service/common';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { EmptyBox } from '@actiontech/dms-kit';
import BestPerformanceIcon from './BestPerformanceIcon';
import { useTranslation } from 'react-i18next';
import FeedbackPanel from './FeedbackPanel';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { normalizeOptimizationModuleState } from '../utils/optimizationModuleState';

export interface RightContentProps {
  isVerticalLayout?: boolean;
  totalAnalysis?: ITotalAnalysis;
  optimizeSteps: IOptimizeStep[];
  errorMessage?: string;
  onOptimizationRuleClick: (stepIndex: number) => void;
  optimizationStatus?: OptimizationSQLDetailStatusEnum;
  optimizationRecordId?: string;
  initialFeedbacks?: IOptimizedSQLFeedback[];
  onFeedbackChanged?: () => void;
  analysisModuleState?: string;
  optimizeModuleState?: string;
}

const RightContent: React.FC<RightContentProps> = ({
  isVerticalLayout = false,
  totalAnalysis,
  optimizeSteps,
  errorMessage,
  onOptimizationRuleClick,
  optimizationStatus,
  optimizationRecordId,
  initialFeedbacks,
  onFeedbackChanged,
  analysisModuleState,
  optimizeModuleState
}) => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();

  const analysisStateNorm =
    normalizeOptimizationModuleState(analysisModuleState);

  const showFeedback =
    !!optimizationRecordId &&
    optimizationStatus !== OptimizationSQLDetailStatusEnum.optimizing;

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
              optimizationStatus === OptimizationSQLDetailStatusEnum.finish &&
              (analysisStateNorm === 'done' || analysisStateNorm === undefined)
            }
            defaultNode={
              <AnalysisChart
                data={totalAnalysis}
                errorMessage={errorMessage}
                optimizationStatus={optimizationStatus}
                moduleState={analysisModuleState}
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
            moduleState={optimizeModuleState}
          />
        </EmptyBox>

        {showFeedback && (
          <>
            <Divider className="feedback-divider-in-right" />
            <FeedbackPanel
              optimizationRecordId={optimizationRecordId}
              initialFeedbacks={initialFeedbacks}
              onFeedbackChanged={onFeedbackChanged}
            />
          </>
        )}
      </Space>
    </SqlOptimizationRightContentWrapper>
  );
};

export default RightContent;
