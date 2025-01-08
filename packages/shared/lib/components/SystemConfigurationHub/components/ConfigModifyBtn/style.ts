import { styled } from '@mui/material';
import { BasicButton } from '../../../BasicButton';

export const SystemConfigModifyBtnStyleWrapper = styled(BasicButton)`
  &.basic-button-wrapper {
    background: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillSecondary} !important;
    border: ${({ theme }) =>
      `1px solid ${theme.sharedTheme.uiToken.colorBorderSecondary}`} !important;
    width: 40px !important;
    height: 24px !important;
    margin-top: 3px !important;
    border-radius: 20px !important;
  }
`;
