import { createTheme } from '@mui/system';
import { sideMenuTheme } from './sideMenu';
import { guidanceTheme } from './guidance';
import { sqleLightTheme } from 'sqle/src/theme/light';
import { systemTheme } from './system';
import { dataExportTheme } from './dataExport';

const lightTheme = createTheme({
  baseTheme: {
    sideMenu: sideMenuTheme,
    guidance: guidanceTheme,
    system: systemTheme,
    dataExport: dataExportTheme
  },
  sqleTheme: sqleLightTheme
});

export default lightTheme;
