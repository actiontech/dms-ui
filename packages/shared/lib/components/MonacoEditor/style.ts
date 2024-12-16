import { styled } from '@mui/material/styles';

export const MonacoEditorContainerStyleWrapper = styled('div')`
  height: 100%;
  border: ${({ theme }) =>
    theme.sharedTheme.components.customMonacoEditor.border};
  border-radius: 6px;
`;
