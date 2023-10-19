import { useBoolean } from 'ahooks';
import React from 'react';
import { SupportTheme } from '../../enum';
import { changeThemeStyle } from './ChangeThemeStyle';

export type ChangeThemeParams = {
  theme: SupportTheme;
  updateTheme: (theme: SupportTheme) => void;
};

const useChangeTheme = ({ theme, updateTheme }: ChangeThemeParams) => {
  const [
    changeLoading,
    { setTrue: startChangeTheme, setFalse: finishChangeTheme }
  ] = useBoolean();

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
    (theme: SupportTheme) => {
      changeThemeStyle({ theme, startChangeTheme, finishChangeTheme });
      updateTheme(theme);
    },
    [finishChangeTheme, startChangeTheme, updateTheme]
  );

  //TODO: implements in backend
  React.useEffect(() => {
    if (theme === SupportTheme.DARK) {
      changeTheme(SupportTheme.DARK);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    changeLoading,
    currentTheme: theme,
    currentEditorTheme,
    changeTheme
  };
};

export default useChangeTheme;
