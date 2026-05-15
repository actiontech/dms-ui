import {
  DataExportTheme,
  GuidanceTheme,
  SideMenuTheme,
  SystemTheme,
  IconTheme,
  ResourceOverviewTheme
} from '../theme/type';

export interface BaseTheme {
  sideMenu: SideMenuTheme;
  guidance: GuidanceTheme;
  system: SystemTheme;
  dataExport: DataExportTheme;
  icon: IconTheme;
  resourceOverview: ResourceOverviewTheme;
}

interface ThemeCustom {
  baseTheme: BaseTheme;
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

declare module '@mui/material/styles' {
  interface Theme extends ThemeCustom {
    noUse: string;
  }
  // 允许配置文件使用 `createTheme`
  interface ThemeOptions extends Partial<ThemeCustom> {
    noUse?: string;
  }
}
