import { createTheme } from '@mui/material/styles';
import { SqleTheme } from '../../types/theme.type';
import { statisticsTheme } from './statistics';
import { reportStatisticsTheme } from './reportStatistics';
import { projectOverviewTheme } from './projectOverview';
import { workflowTemplateTheme } from './workflowTemplate';
import { execWorkflowTheme } from './execWorkflow';
import { iconTheme } from './icon';

export const sqleLightTheme: SqleTheme = {
  statistics: statisticsTheme,
  reportStatistics: reportStatisticsTheme,
  projectOverview: projectOverviewTheme,
  workflowTemplate: workflowTemplateTheme,
  execWorkflow: execWorkflowTheme,
  icon: iconTheme
};

const lightTheme = createTheme({
  sqleTheme: sqleLightTheme
});

export default lightTheme;
