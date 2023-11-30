import React from 'react';
import { SupportTheme } from '@actiontech/shared/lib/enum';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../store';
import { useDispatch } from 'react-redux';
import { updateTheme } from '../../store/user';

const useChangeTheme = () => {
  const theme = useSelector<IReduxState, SupportTheme>(
    (state) => state.user.theme
  );
  const dispatch = useDispatch();

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
      dispatch(updateTheme({ theme }));
    },
    [updateTheme, dispatch]
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
