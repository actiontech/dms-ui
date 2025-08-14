import { ThemeProvider, ThemeProviderProps, DEFAULT_THEME_DATA } from './theme';
import { LocaleProvider, LocaleProviderProps } from './locale';
import { SupportTheme } from '../enum';

export interface ConfigProviderProps
  extends ThemeProviderProps,
    LocaleProviderProps {}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
  theme = SupportTheme.LIGHT,
  themeData = DEFAULT_THEME_DATA,
  ...localProps
}) => {
  return (
    <ThemeProvider theme={theme} themeData={themeData}>
      <LocaleProvider {...localProps}>{children}</LocaleProvider>
    </ThemeProvider>
  );
};

export { DEFAULT_THEME_DATA };
