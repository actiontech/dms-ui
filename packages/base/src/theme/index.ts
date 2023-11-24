import sharedDarkTheme from '@actiontech/shared/lib/theme/dark';
import sharedLightTheme from '@actiontech/shared/lib/theme/light';
import lightTheme from './light';
import darkTheme from './dark';
import { SupportTheme } from '@actiontech/shared/lib/enum';

const ThemeData = {
  [SupportTheme.DARK]: {
    ...darkTheme,
    ...sharedDarkTheme
  },
  [SupportTheme.LIGHT]: {
    ...lightTheme,
    ...sharedLightTheme
  }
};

export { SupportTheme, ThemeData };
