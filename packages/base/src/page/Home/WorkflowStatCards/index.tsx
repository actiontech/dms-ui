import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { Card, Typography } from 'antd';
import {
  CheckboxMultipleBlankFilled,
  ClockCircleOutlined,
  EditFilled,
  ProfileSquareFilled
} from '@actiontech/icons';
import { GlobalDashboardService } from '@actiontech/shared/lib/api/sqle';
import { GetGlobalWorkflowListV2FilterCardEnum } from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { RightOutlined } from '@ant-design/icons';
import { WorkflowStatCardsWrapper, WorkflowCardItemWrapper } from './style';

const WORKFLOW_ACCENT: Record<GetGlobalWorkflowListV2FilterCardEnum, string> = {
  [GetGlobalWorkflowListV2FilterCardEnum.pending_for_me]: '#fa8c16',
  [GetGlobalWorkflowListV2FilterCardEnum.initiated_by_me]: '#1677ff',
  [GetGlobalWorkflowListV2FilterCardEnum.archived]: '#52c41a',
  [GetGlobalWorkflowListV2FilterCardEnum.view_all]: '#722ed1'
};

const WorkflowStatCards: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();

  const { data: workflowStats, loading } = useRequest(() =>
    GlobalDashboardService.GetGlobalWorkflowStatisticsV2({})
  );

  const cards = [
    {
      key: GetGlobalWorkflowListV2FilterCardEnum.pending_for_me,
      title: t('dmsHome.workflowCards.workflow.pendingMine'),
      subtitle: t('dmsHome.workflowCards.workflow.pendingMineSubtitle'),
      count: workflowStats?.data?.data?.pending_for_me_count ?? 0,
      icon: <ClockCircleOutlined color="currentColor" width={18} height={18} />,
      accentColor:
        WORKFLOW_ACCENT[GetGlobalWorkflowListV2FilterCardEnum.pending_for_me]
    },
    {
      key: GetGlobalWorkflowListV2FilterCardEnum.initiated_by_me,
      title: t('dmsHome.workflowCards.workflow.initiated'),
      subtitle: t('dmsHome.workflowCards.workflow.initiatedSubtitle'),
      count: workflowStats?.data?.data?.initiated_by_me_count ?? 0,
      icon: <EditFilled color="currentColor" width={18} height={18} />,
      accentColor:
        WORKFLOW_ACCENT[GetGlobalWorkflowListV2FilterCardEnum.initiated_by_me]
    },
    {
      key: GetGlobalWorkflowListV2FilterCardEnum.archived,
      title: t('dmsHome.workflowCards.workflow.archived'),
      subtitle: t('dmsHome.workflowCards.workflow.archivedSubtitle'),
      count: workflowStats?.data?.data?.archived_count ?? 0,
      icon: <ProfileSquareFilled color="currentColor" width={18} height={18} />,
      accentColor:
        WORKFLOW_ACCENT[GetGlobalWorkflowListV2FilterCardEnum.archived]
    },
    {
      key: GetGlobalWorkflowListV2FilterCardEnum.view_all,
      title: t('dmsHome.workflowCards.workflow.viewAll'),
      subtitle: t('dmsHome.workflowCards.workflow.viewAllSubtitle'),
      count: workflowStats?.data?.data?.view_all_count ?? 0,
      icon: (
        <CheckboxMultipleBlankFilled
          color="currentColor"
          width={18}
          height={18}
        />
      ),
      accentColor:
        WORKFLOW_ACCENT[GetGlobalWorkflowListV2FilterCardEnum.view_all]
    }
  ];

  return (
    <WorkflowStatCardsWrapper>
      <Card className="workflow-cards-card" loading={loading}>
        <div className="cards-content">
          <div className="cards-left-section">
            <div className="section-title">
              {t('dmsHome.workflowCards.sectionTitle')}
            </div>
            <div className="section-description">
              {t('dmsHome.workflowCards.sectionDescription')}
            </div>
            <Typography.Link
              className="section-link"
              onClick={() =>
                navigate(ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD.index, {
                  queries: { tab: 'workflow' }
                })
              }
            >
              {t('dmsHome.workflowCards.viewAll')} <RightOutlined />
            </Typography.Link>
          </div>
          <div className="cards-row">
            {cards.map((card) => (
              <WorkflowCardItemWrapper
                key={card.key}
                $accentColor={card.accentColor}
                onClick={() =>
                  navigate(ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD.index, {
                    queries: { tab: 'workflow', card: card.key }
                  })
                }
              >
                <div className="card-header">
                  <span className="card-icon">{card.icon}</span>
                  <span className="card-title">{card.title}</span>
                </div>
                <div className="card-count">{card.count}</div>
                <div className="card-subtitle">{card.subtitle}</div>
              </WorkflowCardItemWrapper>
            ))}
          </div>
        </div>
      </Card>
    </WorkflowStatCardsWrapper>
  );
};

export default WorkflowStatCards;
