import { createTheme } from '@mui/system';
import { sideMenuTheme } from './sideMenu';
import { guidanceTheme } from './guidance';
import { systemTheme } from './system';
import { dataExportTheme } from './dataExport';
import { sqleDarkTheme } from 'sqle/src/theme/dark';
import { iconTheme } from './icon';
import { resourceOverviewTheme } from './resourceOverview';

const darkTheme = createTheme({
  baseTheme: {
    sideMenu: sideMenuTheme,
    guidance: guidanceTheme,
    system: systemTheme,
    dataExport: dataExportTheme,
    icon: iconTheme,
    resourceOverview: resourceOverviewTheme
  },
  sqleTheme: sqleDarkTheme
});

export default darkTheme;
