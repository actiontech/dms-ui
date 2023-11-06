import { createTheme } from '@mui/system';
import { monitorSourceConfigTheme } from './monitorSourceConfig';
import { DiagnosisTheme } from '../../types/theme.type';

export const diagnosisLightTheme: DiagnosisTheme = {
  monitorSourceConfig: monitorSourceConfigTheme
};

const lightTheme = createTheme({
  diagnosisTheme: diagnosisLightTheme
});

export default lightTheme;
