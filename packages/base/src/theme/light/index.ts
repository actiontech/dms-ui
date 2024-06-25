import { createTheme } from '@mui/system';
import { sideMenuTheme } from './sideMenu';
import { guidanceTheme } from './guidance';
import { sqleLightTheme } from 'sqle/src/theme/light';
import { systemTheme } from './system';
import { dataExportTheme } from './dataExport';
import { iconThem } from './icon';

const lightTheme = createTheme({
  baseTheme: {
    sideMenu: sideMenuTheme,
    guidance: guidanceTheme,
    system: systemTheme,
    dataExport: dataExportTheme,
    icon: iconThem
  },
  sqleTheme: sqleLightTheme
});

export default lightTheme;
