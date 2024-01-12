import { SupportTheme, ThemeData } from '../../theme';
import * as useThemeStyleData from '../../hooks/useThemeStyleData';

const themeData = ThemeData[SupportTheme.LIGHT];

export const mockThemeStyleData = () => {
  const spy = jest.spyOn(useThemeStyleData, 'default');
  spy.mockImplementation(() => ({
    sharedTheme: themeData.sharedTheme,
    sqleTheme: themeData.sqleTheme
  }));
};
