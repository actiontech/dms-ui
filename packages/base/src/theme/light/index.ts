import { createTheme } from '@mui/system';
import { sideMenuTheme } from './sideMenu';
import { guidanceTheme } from './guidance';
import { sqleLightTheme } from 'sqle/src/theme/light';
import { systemTheme } from './system';

const lightTheme = createTheme({
  baseTheme: {
    sideMenu: sideMenuTheme,
    guidance: guidanceTheme,
    system: systemTheme
  },
  sqleTheme: sqleLightTheme
});

export default lightTheme;
