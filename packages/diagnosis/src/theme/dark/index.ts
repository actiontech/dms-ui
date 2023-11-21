import { createTheme } from '@mui/system';
import { monitorSourceConfigTheme } from './monitorSourceConfig';
import { DiagnosisTheme } from '../../types/theme.type';
import { loginTheme } from './login';
import { sideMenuTheme } from './sideMenu';

export const diagnosisDarkTheme: DiagnosisTheme = {
  login: loginTheme,
  monitorSourceConfig: monitorSourceConfigTheme,
  sideMenu: sideMenuTheme
};

const darkTheme = createTheme({
  diagnosisTheme: diagnosisDarkTheme
});

export default darkTheme;
