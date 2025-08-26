import darkTheme from './dark';
import lightTheme from './light';
import sharedDarkTheme from '@actiontech/dms-kit/es/theme/dark';
import sharedLightTheme from '@actiontech/dms-kit/es/theme/light';
import { SupportTheme } from '@actiontech/dms-kit';

const ThemeData = {
  [SupportTheme.DARK]: { ...darkTheme, ...sharedDarkTheme },
  [SupportTheme.LIGHT]: {
    ...lightTheme,
    ...sharedLightTheme
  }
};

export { SupportTheme, ThemeData };
