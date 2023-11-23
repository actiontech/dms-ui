import { createTheme } from '@mui/system';
import { lightThemeBasic, lightThemeUI } from './basic';
import { lightComponentsTheme } from './components';
import { navTheme } from './nav';

const lightTheme = createTheme({
  sharedTheme: {
    ...lightThemeUI,
    ...lightThemeBasic,
    components: lightComponentsTheme,
    nav: navTheme
  }
});

export default lightTheme;
