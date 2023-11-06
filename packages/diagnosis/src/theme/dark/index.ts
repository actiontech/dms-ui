import { createTheme } from '@mui/system';
import { monitorSourceConfigTheme } from './monitorSourceConfig';
import { DiagnosisTheme } from '../../types/theme.type';

export const diagnosisDarkTheme: DiagnosisTheme = {
  monitorSourceConfig: monitorSourceConfigTheme
};

const darkTheme = createTheme({
  diagnosisTheme: diagnosisDarkTheme
});

export default darkTheme;
