import { styled } from '@mui/material/styles';
import { BasicInput } from '@actiontech/shared';

export const PasswordWidthGenerateStyleWrapper = styled(BasicInput.Password)`
  .suffix-icon {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  }
`;
