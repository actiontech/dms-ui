import { createTheme } from '@mui/material/styles';
import { statisticsTheme } from './statistics';
import { SqleTheme } from '../../types/theme.type';
import { reportStatisticsTheme } from './reportStatistics';
import { projectOverviewTheme } from './projectOverview';
import { workflowTemplateTheme } from './workflowTemplate';
import { execWorkflowTheme } from './execWorkflow';
import { iconTheme } from './icon';
import { dataSourceComparisonTheme } from './dataSourceComparison';
import { knowledgeTheme } from './knowledge';
import { sqlInsightTheme } from './sqlInsight';
import { sqlOptimizationTheme } from './sqlOptimization';

export const sqleDarkTheme: SqleTheme = {
  statistics: statisticsTheme,
  reportStatistics: reportStatisticsTheme,
  projectOverview: projectOverviewTheme,
  workflowTemplate: workflowTemplateTheme,
  execWorkflow: execWorkflowTheme,
  icon: iconTheme,
  dataSourceComparison: dataSourceComparisonTheme,
  knowledgeTheme: knowledgeTheme,
  sqlInsight: sqlInsightTheme,
  sqlOptimization: sqlOptimizationTheme
};

const darkTheme = createTheme({
  sqleTheme: sqleDarkTheme
});

export default darkTheme;
