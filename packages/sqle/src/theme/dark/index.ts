import { createTheme } from '@mui/material/styles';
import { statisticsTheme } from './statistics';
import { SqleTheme } from '../../types/theme.type';
import { reportStatisticsTheme } from './reportStatistics';
import { orderTheme } from './order';
import { projectOverviewTheme } from './projectOverview';
import { auditPlanTheme } from './auditPlan';
import { workflowTemplateTheme } from './workflowTemplate';

export const sqleDarkTheme: SqleTheme = {
  statistics: statisticsTheme,
  reportStatistics: reportStatisticsTheme,
  order: orderTheme,
  projectOverview: projectOverviewTheme,
  auditPlan: auditPlanTheme,
  workflowTemplate: workflowTemplateTheme
};

const darkTheme = createTheme({
  sqleTheme: sqleDarkTheme
});

export default darkTheme;
