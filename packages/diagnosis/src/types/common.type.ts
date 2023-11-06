import { DiagnosisTheme } from './theme.type';

export type {
  Dictionary,
  StringDictionary,
  ModalStatus,
  TableChange,
  TableColumn
} from '@actiontech/shared/lib/types/common.type';

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
