import { createTheme } from '@mui/system';
import { darkThemeBasic, darkThemeUI } from './basic';
import { darkComponentsTheme } from './components';

const darkTheme = createTheme({
  sharedTheme: {
    ...darkThemeUI,
    ...darkThemeBasic,
    components: darkComponentsTheme
  }
});

export default darkTheme;
