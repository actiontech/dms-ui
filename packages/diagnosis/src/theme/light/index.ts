import { createTheme } from '@mui/system';
import { monitorSourceConfigTheme } from './monitorSourceConfig';
import { DiagnosisTheme } from '../../types/theme.type';
import { loginTheme } from './login';
import { userManagementTheme } from './userManagement';

export const diagnosisLightTheme: DiagnosisTheme = {
  login: loginTheme,
  monitorSourceConfig: monitorSourceConfigTheme,
  userManagement: userManagementTheme
};

const lightTheme = createTheme({
  diagnosisTheme: diagnosisLightTheme
});

export default lightTheme;
