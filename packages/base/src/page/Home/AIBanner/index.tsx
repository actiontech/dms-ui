import { useMemo, useState } from 'react';
import { useRequest } from 'ahooks';
import { Card, Space, Typography, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicButton, BasicTag, useTypedNavigate } from '@actiontech/shared';
import { AiHubService } from '@actiontech/shared/lib/api/sqle';
import {
  ClockCircleOutlined,
  ThunderboltOutlined,
  RightOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { AiOutlined } from '@actiontech/icons';
import { AIBannerStyleWrapper } from './style';
import useRecentlyOpenedProjects from '../../Nav/SideMenu/useRecentlyOpenedProjects';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { AIModuleBannerCardsAiModuleTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IAIModuleBannerCards } from '@actiontech/shared/lib/api/sqle/service/common.d';
import {
  PERMISSIONS,
  useCurrentUser,
  usePermission
} from '@actiontech/shared/lib/features';
import NotFoundProject from '../DefaultScene/components/NotFoundProject';
import SqlRewrittenExampleDrawer from './components/SqlRewrittenExampleDrawer';

const DEFAULT_METRIC_VALUE = '-';

type PendingProjectAction = 'performance' | null;

const AIBanner: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { bindProjects } = useCurrentUser();
  const { currentProjectID, updateRecentlyProject } =
    useRecentlyOpenedProjects();
  const [openProjectSelectorModal, setOpenProjectSelectorModal] =
    useState(false);
  const [pendingAction, setPendingAction] =
    useState<PendingProjectAction>(null);
  const [openSqlRewrittenExampleDrawer, setOpenSqlRewrittenExampleDrawer] =
    useState(false);
  const { checkPagePermission } = usePermission();

  const { data: bannerData, loading } = useRequest(() => {
    return AiHubService.GetAIHubBanner().then((res) => {
      return res.data?.data;
    });
  });

  const bannerState = useMemo(() => {
    const modules = bannerData?.modules ?? [];
    const isModuleEnabled = (module?: IAIModuleBannerCards) =>
      Boolean(module?.is_enabled);
    const performanceEngineModule = modules.find(
      (module) =>
        module.ai_module_type ===
        AIModuleBannerCardsAiModuleTypeEnum.performance_engine
    );
    const smartCorrectionModule = modules.find(
      (module) =>
        module.ai_module_type ===
        AIModuleBannerCardsAiModuleTypeEnum.smart_correction
    );

    const performanceEngineCard = performanceEngineModule?.banner_cards?.[0];
    const smartCorrectionCard = smartCorrectionModule?.banner_cards?.[0];

    const showPerformanceModule = Boolean(performanceEngineCard?.need_display);
    const showSmartCorrectionModule = Boolean(
      smartCorrectionCard?.need_display
    );

    const allModulesDisabled =
      modules.length === 0 ||
      modules.every((module) => !isModuleEnabled(module));

    return {
      allModulesDisabled,
      showPerformanceModule,
      showSmartCorrectionModule,
      performanceEnabled: isModuleEnabled(performanceEngineModule),
      smartCorrectionEnabled: isModuleEnabled(smartCorrectionModule),
      metrics: {
        riskIntercept: {
          value: smartCorrectionCard?.evidence_value ?? DEFAULT_METRIC_VALUE,
          evaluation: smartCorrectionCard?.metric_evaluation || ''
        },
        performanceOptimization: {
          value: performanceEngineCard?.evidence_value ?? DEFAULT_METRIC_VALUE,
          evaluation: performanceEngineCard?.metric_evaluation || ''
        }
      }
    };
  }, [bannerData]);

  const showPaidFeaturePrompt = () => {
    messageApi.info(t('dmsHome.aiBanner.paidFeaturePrompt'));
  };

  // 处理查看完整报告跳转
  const handleViewFullReport = () => {
    if (bannerState.allModulesDisabled) {
      showPaidFeaturePrompt();
      return;
    }

    navigate(ROUTE_PATHS.SQLE.REPORT_STATISTICS.index, {
      queries: { tab: 'ai-governance' }
    });
  };

  // 处理AI性能引擎跳转
  const handleAIPerformanceEngine = () => {
    if (!bannerState.performanceEnabled) {
      showPaidFeaturePrompt();
      return;
    }

    if (!currentProjectID) {
      setPendingAction('performance');
      setOpenProjectSelectorModal(true);
      return;
    }
    navigate(ROUTE_PATHS.SQLE.SQL_AUDIT.create_optimization, {
      params: {
        projectID: currentProjectID
      }
    });
  };

  // 处理AI智能修正跳转
  const handleAISmartCorrection = () => {
    if (!bannerState.smartCorrectionEnabled) {
      showPaidFeaturePrompt();
      return;
    }
    setOpenSqlRewrittenExampleDrawer(true);
  };

  // 选择项目后的跳转地址（与 DefaultScene 的规则页跳转对应，AIBanner 按待执行操作跳转）
  const handleAfterSelectProject = (projectID: string) => {
    if (pendingAction === 'performance') {
      setPendingAction(null);
      navigate(ROUTE_PATHS.SQLE.SQL_OPTIMIZATION.create, {
        params: { projectID }
      });
    }
  };

  const showPerformanceEngineButton = bannerState.showPerformanceModule;
  const showSmartCorrectionButton = bannerState.showSmartCorrectionModule;
  const showRiskInterceptMetric = bannerState.showSmartCorrectionModule;
  const showPerformanceOptimizationMetric = bannerState.showPerformanceModule;

  return (
    <AIBannerStyleWrapper>
      {messageContextHolder}
      <Card className="ai-banner-card" loading={loading}>
        <div className="banner-content">
          {/* 左侧：AI治理效能洞察 */}
          <div className="left-section">
            <div className="insight-header">
              <div className="insight-icon">
                <AiOutlined />
              </div>
              <div className="insight-title">
                {t('dmsHome.aiBanner.insightTitle')}
              </div>
            </div>
            <div className="insight-description">
              {t('dmsHome.aiBanner.insightDescription')}
            </div>
            {checkPagePermission(PERMISSIONS.PAGES.SQLE.REPORT_STATISTICS) && (
              <Typography.Link
                className="view-report-link"
                onClick={handleViewFullReport}
              >
                {t('dmsHome.aiBanner.viewFullReport')} <RightOutlined />
              </Typography.Link>
            )}
          </div>

          {/* 中间：核心指标（接口存在对应模块时隐藏对应指标） */}
          <div className="middle-section">
            {showRiskInterceptMetric && (
              <div className="metric-item">
                <div className="metric-header">
                  <ClockCircleOutlined className="metric-icon" />
                  <span className="metric-label">
                    {t('dmsHome.aiBanner.riskIntercept')}
                  </span>
                </div>
                <div className="metric-value">
                  {bannerState.metrics.riskIntercept.value}
                  <span className="metric-unit">
                    {t('dmsHome.aiBanner.times')}
                  </span>
                </div>
                {bannerState.metrics.riskIntercept.evaluation && (
                  <BasicTag color="green" className="metric-tag">
                    {bannerState.metrics.riskIntercept.evaluation}
                  </BasicTag>
                )}
              </div>
            )}

            {showPerformanceOptimizationMetric && (
              <div className="metric-item">
                <div className="metric-header">
                  <ThunderboltOutlined className="metric-icon" />
                  <span className="metric-label">
                    {t('dmsHome.aiBanner.performanceOptimization')}
                  </span>
                </div>
                <div className="metric-value">
                  {bannerState.metrics.performanceOptimization.value}
                  <span className="metric-unit">
                    {t('dmsHome.aiBanner.times')}
                  </span>
                </div>
                {bannerState.metrics.performanceOptimization.evaluation && (
                  <BasicTag color="cyan" className="metric-tag">
                    {bannerState.metrics.performanceOptimization.evaluation}
                  </BasicTag>
                )}
              </div>
            )}
          </div>

          {/* 右侧：快捷行动按钮 */}
          <div className="right-section">
            {showPerformanceEngineButton &&
              checkPagePermission(PERMISSIONS.PAGES.SQLE.SQL_OPTIMIZATION) && (
                <BasicButton
                  type="primary"
                  size="large"
                  className="action-button primary-button"
                  onClick={handleAIPerformanceEngine}
                >
                  <Space>
                    {t('dmsHome.aiBanner.aiPerformanceEngine')}
                    <RightOutlined />
                  </Space>
                </BasicButton>
              )}
            {showSmartCorrectionButton && (
              <BasicButton
                size="large"
                className="action-button secondary-button"
                onClick={handleAISmartCorrection}
              >
                <Space>
                  {t('dmsHome.aiBanner.aiSmartCorrection')}
                  <CheckCircleOutlined />
                </Space>
              </BasicButton>
            )}
          </div>
        </div>
      </Card>

      <NotFoundProject
        open={openProjectSelectorModal}
        setOpen={setOpenProjectSelectorModal}
        bindProjects={bindProjects}
        updateRecentlyProject={updateRecentlyProject}
        onAfterSelectProject={handleAfterSelectProject}
      />
      <SqlRewrittenExampleDrawer
        open={openSqlRewrittenExampleDrawer}
        onClose={() => setOpenSqlRewrittenExampleDrawer(false)}
      />
    </AIBannerStyleWrapper>
  );
};

export default AIBanner;
