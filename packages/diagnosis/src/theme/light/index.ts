import { createTheme } from '@mui/system';
import { monitorSourceConfigTheme } from './monitorSourceConfig';
import { DiagnosisTheme } from '../../types/theme.type';
import { loginTheme } from './login';

export const diagnosisLightTheme: DiagnosisTheme = {
  login: loginTheme,
  monitorSourceConfig: monitorSourceConfigTheme
};

const lightTheme = createTheme({
  diagnosisTheme: diagnosisLightTheme
});

export default lightTheme;
