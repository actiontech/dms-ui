import { SupportTheme } from '@actiontech/dms-kit';
import useCurrentUser from '../useCurrentUser';
import { useCallback, useEffect, useMemo } from 'react';

const useChangeTheme = () => {
  const { theme, updateTheme } = useCurrentUser();

  const currentEditorTheme = useMemo(() => {
    switch (theme) {
      case SupportTheme.DARK:
        return 'vs-dark';
      case SupportTheme.LIGHT:
      default:
        return 'vs';
    }
  }, [theme]);

  const changeTheme = useCallback(
    (_theme: SupportTheme) => {
      updateTheme(_theme);
    },
    [updateTheme]
  );

  //TODO: implements in backend
  useEffect(() => {
    if (theme === SupportTheme.DARK) {
      changeTheme(SupportTheme.DARK);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 根据主题设置 data-theme 属性，用于 CSS 变量切换
  useEffect(() => {
    const root = document.documentElement;
    if (theme === SupportTheme.DARK) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  return {
    currentTheme: theme,
    currentEditorTheme,
    changeTheme
  };
};

export default useChangeTheme;
