import {
  StyledEngineProvider,
  ThemeProvider as MuiThemeProvider
} from '@mui/system';
import { ReactNode } from 'react';
import { SupportTheme } from '../enum';
import darkTheme from '../theme/dark';
import lightTheme from '../theme/light';

import '../types/theme.type';

const DEFAULT_THEME_DATA = {
  [SupportTheme.DARK]: darkTheme,
  [SupportTheme.LIGHT]: lightTheme
};

export interface ThemeProviderProps {
  children: ReactNode;
  themeData?: typeof DEFAULT_THEME_DATA;
  theme?: SupportTheme
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  themeData = DEFAULT_THEME_DATA,
  theme = SupportTheme.LIGHT
}) => {
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={themeData[theme]}>{children}</MuiThemeProvider>
    </StyledEngineProvider>
  );
};

export { DEFAULT_THEME_DATA };
