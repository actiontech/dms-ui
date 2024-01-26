import { styled } from '@mui/material/styles';
import { IconExportWorkflowCreateTitle } from '../../../../../../icon/dataExport';

export const IconTaskCreateTitleStyleWrapper = styled(
  IconExportWorkflowCreateTitle
)`
  &.title-icon {
    color: ${({ theme }) =>
      theme.baseTheme.dataExport.create.form.baseInfoTitleIconColor};
  }
`;
