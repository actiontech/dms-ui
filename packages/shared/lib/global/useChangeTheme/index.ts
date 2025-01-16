import React from 'react';
import { SupportTheme } from '../../enum';
import useCurrentUser from '../useCurrentUser';

const useChangeTheme = () => {
  const { theme, updateTheme } = useCurrentUser();

  const currentEditorTheme = React.useMemo(() => {
    switch (theme) {
      case SupportTheme.DARK:
        return 'vs-dark';
      case SupportTheme.LIGHT:
      default:
        return 'vs';
    }
  }, [theme]);

  const changeTheme = React.useCallback(
    (_theme: SupportTheme) => {
      updateTheme(_theme);
    },
    [updateTheme]
  );

  //TODO: implements in backend
  React.useEffect(() => {
    if (theme === SupportTheme.DARK) {
      changeTheme(SupportTheme.DARK);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    currentTheme: theme,
    currentEditorTheme,
    changeTheme
  };
};

export default useChangeTheme;
