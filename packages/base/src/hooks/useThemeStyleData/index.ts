import { useMemo } from 'react';
import { ThemeData } from '../../theme';
import { useCurrentUser } from '@actiontech/shared/lib/global';

const useThemeStyleData = () => {
  const { theme } = useCurrentUser();

  const themeData = useMemo(() => {
    return ThemeData[theme];
  }, [theme]);

  return {
    baseTheme: themeData.baseTheme,
    sharedTheme: themeData.sharedTheme,
    sqleTheme: themeData.sqleTheme
  };
};

export default useThemeStyleData;
