import { createTheme } from '@mui/system';
import { monitorSourceConfigTheme } from './monitorSourceConfig';
import { DiagnosisTheme } from '../../types/theme.type';
import { loginTheme } from './login';
import { userManagementTheme } from './userManagement';

export const diagnosisDarkTheme: DiagnosisTheme = {
  login: loginTheme,
  monitorSourceConfig: monitorSourceConfigTheme,
  userManagement: userManagementTheme
};

const darkTheme = createTheme({
  diagnosisTheme: diagnosisDarkTheme
});

export default darkTheme;
