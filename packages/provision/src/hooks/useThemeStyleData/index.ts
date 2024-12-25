import { useMemo } from 'react';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import sharedDarkTheme from '@actiontech/shared/lib/theme/dark';
import sharedLightTheme from '@actiontech/shared/lib/theme/light';
import { SupportTheme } from '@actiontech/shared/lib/enum';

const useThemeStyleData = () => {
  const { theme } = useCurrentUser();
  const themeData = useMemo(() => {
    return theme === SupportTheme.DARK ? sharedDarkTheme : sharedLightTheme;
  }, [theme]);

  return themeData;
};

export default useThemeStyleData;
