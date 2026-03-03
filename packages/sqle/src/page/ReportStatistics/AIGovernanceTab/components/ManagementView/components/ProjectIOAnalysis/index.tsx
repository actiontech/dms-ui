import { Progress, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { IProjectIOAnalysis } from '@actiontech/shared/lib/api/sqle/service/common.d';
import { ActiontechTable, ActiontechTableColumn } from '@actiontech/dms-kit';
import { ProjectIOAnalysisStyleWrapper } from './style';
import useThemeStyleData from '../../../../../../../hooks/useThemeStyleData';

interface ProjectIOAnalysisProps {
  data: IProjectIOAnalysis[];
  viewType?: 'rewrite' | 'tuning';
}

const ProjectIOAnalysis: React.FC<ProjectIOAnalysisProps> = ({
  data,
  viewType = 'tuning'
}) => {
  const { t } = useTranslation();
  const { sqleTheme, sharedTheme } = useThemeStyleData();

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) {
      return sqleTheme.reportStatistics.ProjectIOAnalysis.healthScore.excellent;
    }
    if (score >= 80) {
      return sqleTheme.reportStatistics.ProjectIOAnalysis.healthScore.good;
    }
    if (score >= 60) {
      return sqleTheme.reportStatistics.ProjectIOAnalysis.healthScore.normal;
    }
    return sqleTheme.reportStatistics.ProjectIOAnalysis.healthScore.poor;
  };

  const columnData: () => ActiontechTableColumn<IProjectIOAnalysis> = () => {
    const columns: ActiontechTableColumn<IProjectIOAnalysis> = [
      {
        title: t(
          'reportStatistics.aiGovernance.managementView.projectIOAnalysis.columns.projectName'
        ),
        dataIndex: 'project_name',
        key: 'project_name',
        render: (
          value: string | undefined,
          _: IProjectIOAnalysis,
          index: number
        ) => (
          <div className="project-name-cell">
            <span
              className={`project-rank-badge ${index === 0 ? 'is-top1' : ''}`}
            >
              {index + 1}
            </span>
            <span>{value ?? '-'}</span>
          </div>
        )
      },
      {
        title: t(
          'reportStatistics.aiGovernance.managementView.projectIOAnalysis.columns.activeMembers'
        ),
        dataIndex: 'active_members',
        key: 'active_members'
      },
      {
        title: t(
          'reportStatistics.aiGovernance.managementView.projectIOAnalysis.columns.invokeCount'
        ),
        dataIndex: 'invoke_count',
        key: 'invoke_count'
      },
      {
        title: t(
          'reportStatistics.aiGovernance.managementView.projectIOAnalysis.columns.timeSaved'
        ),
        dataIndex: 'time_saved',
        key: 'time_saved',
        render: (value: number | undefined) =>
          value != null
            ? `${value} ${t('common.time.hour', { count: value })}`
            : '-'
      },
      {
        title: t(
          'reportStatistics.aiGovernance.managementView.projectIOAnalysis.columns.healthScore'
        ),
        dataIndex: 'health_score',
        key: 'health_score',
        align: 'right',
        render: (value: number | undefined) => {
          if (value == null) {
            return '-';
          }
          const scoreColor = getHealthScoreColor(value);
          return (
            <div className="health-score-cell">
              <Progress
                percent={value}
                showInfo={false}
                strokeColor={scoreColor}
                trailColor={
                  sqleTheme.reportStatistics.ProjectIOAnalysis.healthScore
                    .trailColor
                }
                size={[80, 6]}
              />
              <Typography.Text
                className="health-score-value"
                style={{ color: sharedTheme.uiToken.colorTextBase }}
              >
                {value}
              </Typography.Text>
            </div>
          );
        }
      }
    ];

    if (viewType === 'tuning') {
      columns.splice(3, 0, {
        title: t(
          'reportStatistics.aiGovernance.managementView.projectIOAnalysis.columns.performanceGain'
        ),
        dataIndex: 'performance_gain',
        key: 'performance_gain'
      });
    }

    return columns;
  };

  return (
    <ProjectIOAnalysisStyleWrapper>
      <ActiontechTable
        columns={columnData()}
        dataSource={data}
        rowKey="project_name"
        pagination={false}
        size="small"
      />
    </ProjectIOAnalysisStyleWrapper>
  );
};

export default ProjectIOAnalysis;
