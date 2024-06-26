import { createTheme } from '@mui/material/styles';
import { statisticsTheme } from './statistics';
import { SqleTheme } from '../../types/theme.type';
import { reportStatisticsTheme } from './reportStatistics';
import { projectOverviewTheme } from './projectOverview';
import { auditPlanTheme } from './auditPlan';
import { workflowTemplateTheme } from './workflowTemplate';
import { execWorkflowTheme } from './execWorkflow';
import { iconTheme } from './icon';

export const sqleDarkTheme: SqleTheme = {
  statistics: statisticsTheme,
  reportStatistics: reportStatisticsTheme,
  projectOverview: projectOverviewTheme,
  auditPlan: auditPlanTheme,
  workflowTemplate: workflowTemplateTheme,
  execWorkflow: execWorkflowTheme,
  icon: iconTheme
};

const darkTheme = createTheme({
  sqleTheme: sqleDarkTheme
});

export default darkTheme;
