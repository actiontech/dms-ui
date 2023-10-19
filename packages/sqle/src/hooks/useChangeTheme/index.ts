import React from 'react';
import { SupportTheme, ThemeData } from '../../theme';
import { useCurrentUser } from '@actiontech/shared/lib/global';

const useChangeTheme = () => {
  const { theme } = useCurrentUser();

  const currentThemeData = React.useMemo(() => {
    switch (theme) {
      case SupportTheme.DARK:
        return ThemeData[SupportTheme.DARK];
      case SupportTheme.LIGHT:
      default:
        return ThemeData[SupportTheme.LIGHT];
    }
  }, [theme]);

  const currentEditorTheme = React.useMemo(() => {
    switch (theme) {
      case SupportTheme.DARK:
        return 'vs-dark';
      case SupportTheme.LIGHT:
      default:
        return 'light';
    }
  }, [theme]);

  return {
    currentTheme: theme,
    currentEditorTheme,
    currentThemeData
  };
};

export default useChangeTheme;
