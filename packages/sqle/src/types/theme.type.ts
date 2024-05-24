import {
  ReportStatisticsTheme,
  StatisticsTheme,
  ProjectOverviewTheme,
  AuditPlanTheme,
  WorkflowTemplateTheme,
  ExecWorkflowTheme
} from '../theme/type';

export interface SqleTheme {
  statistics: StatisticsTheme;
  reportStatistics: ReportStatisticsTheme;
  projectOverview: ProjectOverviewTheme;
  auditPlan: AuditPlanTheme;
  workflowTemplate: WorkflowTemplateTheme;
  execWorkflow: ExecWorkflowTheme;
}

interface ThemeCustom {
  common: {
    padding: number;
    color: {
      warning: string;
      disabledFont: string;
    };
  };
  header: {
    background: string;
    color: string;
  };
  editor: {
    border: string;
  };
  projectLayoutSider: {
    border: string;
  };
  optionsHover: {
    background: string;
  };
  auditResultLevelNormalBox: {
    border: string;
    color: string;
  };
  sqleTheme: SqleTheme;
}

declare module '@mui/system' {
  interface Theme extends ThemeCustom {
    noUse: string;
  }
  // 允许配置文件使用 `createTheme`
  interface ThemeOptions extends Partial<ThemeCustom> {
    noUse?: string;
  }
}

declare module '@mui/material' {
  interface Theme extends ThemeCustom {
    noUse: string;
  }
  // 允许配置文件使用 `createTheme`
  interface DeprecatedThemeOptions extends Partial<ThemeCustom> {
    noUse?: string;
  }
}

declare module '@mui/material/styles' {
  interface DefaultTheme extends Theme {}
}

declare module '@mui/material/styles' {
  interface Theme extends ThemeCustom {
    noUse: string;
  }
  // 允许配置文件使用 `createTheme`
  interface ThemeOptions extends Partial<ThemeCustom> {
    noUse?: string;
  }
}
