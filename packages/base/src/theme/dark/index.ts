import { createTheme } from '@mui/system';
import { sideMenuTheme } from './sideMenu';
import { guidanceTheme } from './guidance';
import { systemTheme } from './system';
import { dataExportTheme } from './dataExport';
import { sqleDarkTheme } from 'sqle/src/theme/dark';
import { iconThem } from './icon';

const darkTheme = createTheme({
  baseTheme: {
    sideMenu: sideMenuTheme,
    guidance: guidanceTheme,
    system: systemTheme,
    dataExport: dataExportTheme,
    icon: iconThem
  },
  sqleTheme: sqleDarkTheme
});

export default darkTheme;
