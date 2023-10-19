import {
  OrderTheme,
  ReportStatisticsTheme,
  StatisticsTheme,
  ProjectOverviewTheme,
  AuditPlanTheme,
  WorkflowTemplateTheme
} from '../theme/type';

export interface SqleTheme {
  statistics: StatisticsTheme;
  reportStatistics: ReportStatisticsTheme;
  order: OrderTheme;
  projectOverview: ProjectOverviewTheme;
  auditPlan: AuditPlanTheme;
  workflowTemplate: WorkflowTemplateTheme;
}
