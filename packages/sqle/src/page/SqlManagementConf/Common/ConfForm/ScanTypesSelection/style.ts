import { ToggleTokens } from '@actiontech/shared';
import { styled } from '@mui/material';

export const ScanTypesSelectorStyleWrapper = styled(ToggleTokens)`
  &.scan-types-selector {
    .toggle-token-item-no-style {
      display: flex;
      justify-content: center !important;
      align-items: center;
      width: 160px;
      height: 34px;
      border: none;
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      transition: background-color 0.3s ease-out;
      transition: color 0.3s ease-out;
    }

    .toggle-token-item-checked {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      background-color: ${({ theme }) =>
        theme.sharedTheme.basic.colorPrimaryBgActive};
    }
  }
`;
