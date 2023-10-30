import { createTheme } from '@mui/material/styles';
import { intelligenceDiagnosisTheme } from './intelligenceDiagnosis';
import { DiagnosisTheme } from '../../types/theme.type';

export const diagnosisDarkTheme: DiagnosisTheme = {
  intelligenceDiagnosis: intelligenceDiagnosisTheme
};

const darkTheme = createTheme({
  diagnosisTheme: diagnosisDarkTheme
});

export default darkTheme;
