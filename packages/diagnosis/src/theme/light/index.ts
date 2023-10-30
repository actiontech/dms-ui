import { createTheme } from '@mui/material/styles';
import { intelligenceDiagnosisTheme } from './intelligenceDiagnosis';
import { DiagnosisTheme } from '../../types/theme.type';

export const diagnosisLightTheme: DiagnosisTheme = {
  intelligenceDiagnosis: intelligenceDiagnosisTheme
};

const lightTheme = createTheme({
  diagnosisTheme: diagnosisLightTheme
});

export default lightTheme;
