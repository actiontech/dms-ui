import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { AiIntelligenceCenterOutlined } from '@actiontech/icons';
import ExecutionData from './components/ExecutionData';
import ManagementView from './components/ManagementView';
import StrategicInsight from './components/StrategicInsight';
import { AIGovernanceTabStyleWrapper } from './style';

const AIGovernanceTab: React.FC = () => {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState<'rewrite' | 'tuning'>('rewrite');

  return (
    <AIGovernanceTabStyleWrapper>
      <div className="ai-governance-title">
        <AiIntelligenceCenterOutlined className="ai-governance-title-icon" />
        <span className="ai-governance-title-main">
          {t('reportStatistics.aiGovernance.title')}
        </span>
      </div>
      <div className="ai-governance-content">
        {/* 决策层：AI战略洞察 */}
        <StrategicInsight />

        {/* 管理层：分析视图 */}
        <ManagementView viewType={viewType} onViewTypeChange={setViewType} />

        {/* 执行层：执行数据 */}
        <ExecutionData />
      </div>
    </AIGovernanceTabStyleWrapper>
  );
};

export default AIGovernanceTab;
