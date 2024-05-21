import { createTheme } from '@mui/material/styles';
import { SqleTheme } from '../../types/theme.type';
import { orderTheme } from './order';
import { statisticsTheme } from './statistics';
import { reportStatisticsTheme } from './reportStatistics';
import { projectOverviewTheme } from './projectOverview';
import { auditPlanTheme } from './auditPlan';
import { workflowTemplateTheme } from './workflowTemplate';
import { execWorkflowTheme } from './execWorkflow';

export const sqleLightTheme: SqleTheme = {
  statistics: statisticsTheme,
  reportStatistics: reportStatisticsTheme,
  order: orderTheme,
  projectOverview: projectOverviewTheme,
  auditPlan: auditPlanTheme,
  workflowTemplate: workflowTemplateTheme,
  execWorkflow: execWorkflowTheme
};

const lightTheme = createTheme({
  sqleTheme: sqleLightTheme
});

export default lightTheme;
