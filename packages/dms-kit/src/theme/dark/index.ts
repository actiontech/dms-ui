import { createTheme } from '@mui/system';
import { darkThemeBasic, darkThemeUI } from './basic';
import { darkComponentsTheme } from './components';
import { navTheme } from './nav';

const darkTheme = createTheme({
  sharedTheme: {
    ...darkThemeUI,
    ...darkThemeBasic,
    components: darkComponentsTheme,
    nav: navTheme
  }
});

export default darkTheme;
