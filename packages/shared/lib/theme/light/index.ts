import { createTheme } from '@mui/system';
import { lightThemeBasic, lightThemeUI } from './basic';
import { lightComponentsTheme } from './components';

const lightTheme = createTheme({
  sharedTheme: {
    ...lightThemeUI,
    ...lightThemeBasic,
    components: lightComponentsTheme
  }
});

export default lightTheme;
