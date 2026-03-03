import { useRequest } from 'ahooks';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicSegmented } from '@actiontech/dms-kit';
import { AiHubService } from '@actiontech/shared/lib/api/sqle';
import { AIModuleAnalysisAiModuleTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  AiPerformanceEngineOutlined,
  AiSmartCorrectionOutlined,
  ManagementViewOutlined,
  ProjectTeamIoAnalysisOutlined,
  TopProblemDistributionOutlined
} from '@actiontech/icons';
import CardWrapper from '../../../../../components/CardWrapper';
import EmitterKey from '../../../../../data/EmitterKey';
import eventEmitter from '../../../../../utils/EventEmitter';
import ModuleTitle from '../ModuleTitle';
import CardSectionTitle from './components/CardSectionTitle';
import { ManagementViewStyleWrapper } from './style';
import ProjectIOAnalysis from './components/ProjectIOAnalysis';
import TopProblemDistribution from './components/TopProblemDistribution';

interface ManagementViewProps {
  viewType: 'rewrite' | 'tuning';
  onViewTypeChange: (type: 'rewrite' | 'tuning') => void;
}

const VIEW_TYPE_TO_MODULE_TYPE: Record<
  ManagementViewProps['viewType'],
  AIModuleAnalysisAiModuleTypeEnum
> = {
  rewrite: AIModuleAnalysisAiModuleTypeEnum.smart_correction,
  tuning: AIModuleAnalysisAiModuleTypeEnum.performance_engine
};

const ManagementView: React.FC<ManagementViewProps> = ({
  viewType,
  onViewTypeChange
}) => {
  const { t } = useTranslation();

  const {
    data: managementData,
    loading,
    run: refresh
  } = useRequest(() => {
    return AiHubService.GetAIHubManagementView().then((res) => {
      return res.data?.data;
    });
  });

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Report_Statistics,
      () => refresh()
    );
    return unsubscribe;
  }, [refresh]);

  const segmentedOptions = useMemo(() => {
    const modules = managementData?.modules;
    if (!modules?.length) {
      return [];
    }

    const moduleTypeSet = new Set(
      modules.map((module) => module.ai_module_type)
    );
    const options: Array<{
      label: React.ReactNode;
      value: ManagementViewProps['viewType'];
    }> = [];

    if (moduleTypeSet.has(AIModuleAnalysisAiModuleTypeEnum.smart_correction)) {
      options.push({
        label: (
          <span className="management-view-segmented-option">
            <AiSmartCorrectionOutlined />
            {t('reportStatistics.aiGovernance.managementView.viewType.rewrite')}
          </span>
        ),
        value: 'rewrite'
      });
    }

    if (
      moduleTypeSet.has(AIModuleAnalysisAiModuleTypeEnum.performance_engine)
    ) {
      options.push({
        label: (
          <span className="management-view-segmented-option">
            <AiPerformanceEngineOutlined />
            {t('reportStatistics.aiGovernance.managementView.viewType.tuning')}
          </span>
        ),
        value: 'tuning'
      });
    }

    return options;
  }, [managementData?.modules, t]);

  useEffect(() => {
    if (!segmentedOptions.length) {
      return;
    }

    const currentViewTypeAvailable = segmentedOptions.some(
      (option) => option.value === viewType
    );
    if (!currentViewTypeAvailable) {
      onViewTypeChange(segmentedOptions[0].value);
    }
  }, [onViewTypeChange, segmentedOptions, viewType]);

  const filteredModules = useMemo(() => {
    const modules = managementData?.modules;
    if (!modules) return undefined;
    const moduleType = VIEW_TYPE_TO_MODULE_TYPE[viewType];
    return modules.filter((module) => module.ai_module_type === moduleType);
  }, [managementData?.modules, viewType]);

  return (
    <ManagementViewStyleWrapper>
      <div className="management-view-header">
        <ModuleTitle
          icon={<ManagementViewOutlined />}
          title={t('reportStatistics.aiGovernance.managementView.moduleTitle')}
          description={t(
            'reportStatistics.aiGovernance.managementView.moduleDesc'
          )}
        />
        <BasicSegmented
          className="management-view-segmented"
          value={viewType}
          onChange={(value) => onViewTypeChange(value as 'rewrite' | 'tuning')}
          options={segmentedOptions}
        />
      </div>
      {filteredModules?.map((module, index) => (
        <div key={index} className="management-view-cards">
          <CardWrapper
            enabledLoading={loading}
            title={
              <CardSectionTitle
                icon={<ProjectTeamIoAnalysisOutlined />}
                title={t(
                  'reportStatistics.aiGovernance.managementView.projectIOAnalysis.moduleTitle'
                )}
                description={t(
                  'reportStatistics.aiGovernance.managementView.projectIOAnalysis.moduleDesc'
                )}
              />
            }
          >
            <ProjectIOAnalysis
              data={module.project_io_analysis || []}
              viewType={viewType}
            />
          </CardWrapper>
          <CardWrapper
            enabledLoading={loading}
            title={
              <CardSectionTitle
                icon={
                  <TopProblemDistributionOutlined className="top-problem-distribution-icon" />
                }
                title={t(
                  'reportStatistics.aiGovernance.managementView.topProblemDistribution.moduleTitle'
                )}
                description={t(
                  'reportStatistics.aiGovernance.managementView.topProblemDistribution.moduleDesc'
                )}
              />
            }
          >
            <TopProblemDistribution
              data={module.top_problem_distribution || []}
            />
          </CardWrapper>
        </div>
      ))}
    </ManagementViewStyleWrapper>
  );
};

export default ManagementView;
