import { makeStyles } from '@mui/styles';
import darkTheme from './dark';
import lightTheme from './light';
import { Theme } from '@mui/material/styles';
import sharedDarkTheme from '@actiontech/shared/lib/theme/dark';
import sharedLightTheme from '@actiontech/shared/lib/theme/light';
import { SupportTheme } from '@actiontech/shared/lib/enum';

const ThemeData = {
  [SupportTheme.DARK]: { ...darkTheme, ...sharedDarkTheme },
  [SupportTheme.LIGHT]: {
    ...lightTheme,
    ...sharedLightTheme
  }
};

const useStyles = makeStyles<Theme>((theme) => ({
  headerBg: {
    backgroundColor: theme.header.background,
    color: theme.header.color
  },
  editor: {
    border: theme.editor.border,
    paddingRight: 1
  },
  projectLayoutSider: {
    borderRight: theme.projectLayoutSider.border
  },
  optionsHover: {
    '&:hover': {
      background: theme.optionsHover.background
    }
  },
  auditResultLevelNormalBox: {
    color: theme.auditResultLevelNormalBox.color,
    border: theme.auditResultLevelNormalBox.border
  }
}));

export { SupportTheme, ThemeData };
export default useStyles;
