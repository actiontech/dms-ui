import {
  LoginTheme,
  MonitorSourceConfigTheme,
  SideMenuTheme
} from '../theme/type';

export interface DiagnosisTheme {
  login: LoginTheme;
  monitorSourceConfig: MonitorSourceConfigTheme;
  sideMenu: SideMenuTheme;
}
interface ThemeCustom {
  diagnosisTheme: DiagnosisTheme;
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
