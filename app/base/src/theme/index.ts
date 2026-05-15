import lightTheme from './light';
import darkTheme from './dark';
import {
  SupportTheme,
  darkTheme as sharedDarkTheme,
  lightTheme as sharedLightTheme
} from '@actiontech/dms-kit';

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
