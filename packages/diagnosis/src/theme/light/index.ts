import { createTheme } from '@mui/system';
import { monitorSourceConfigTheme } from './monitorSourceConfig';
import { DiagnosisTheme } from '../../types/theme.type';
import { loginTheme } from './login';
import { sideMenuTheme } from './sideMenu';

export const diagnosisLightTheme: DiagnosisTheme = {
  login: loginTheme,
  monitorSourceConfig: monitorSourceConfigTheme,
  sideMenu: sideMenuTheme
};

const lightTheme = createTheme({
  diagnosisTheme: diagnosisLightTheme
});

export default lightTheme;
