import { createTheme } from '@mui/system';
import { sideMenuTheme } from './sideMenu';
import { guidanceTheme } from './guidance';
import { systemTheme } from './system';
import { sqleDarkTheme } from 'sqle/src/theme/dark';

const darkTheme = createTheme({
  baseTheme: {
    sideMenu: sideMenuTheme,
    guidance: guidanceTheme,
    system: systemTheme
  },
  sqleTheme: sqleDarkTheme
});

export default darkTheme;
