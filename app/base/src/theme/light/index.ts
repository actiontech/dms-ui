import { createTheme } from '@mui/system';
import { sideMenuTheme } from './sideMenu';
import { guidanceTheme } from './guidance';
import { sqleLightTheme } from 'sqle/src/theme/light';
import { systemTheme } from './system';
import { dataExportTheme } from './dataExport';
import { iconTheme } from './icon';
import { resourceOverviewTheme } from './resourceOverview';

const lightTheme = createTheme({
  baseTheme: {
    sideMenu: sideMenuTheme,
    guidance: guidanceTheme,
    system: systemTheme,
    dataExport: dataExportTheme,
    icon: iconTheme,
    resourceOverview: resourceOverviewTheme
  },
  sqleTheme: sqleLightTheme
});

export default lightTheme;
