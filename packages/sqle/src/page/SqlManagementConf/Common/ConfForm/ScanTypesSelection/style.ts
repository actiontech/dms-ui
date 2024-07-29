import { ToggleTokens } from '@actiontech/shared';
import { styled } from '@mui/material';

export const ScanTypesSelectorStyleWrapper = styled(ToggleTokens)`
  &.scan-types-selector {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .toggle-token-item-no-style {
      display: flex;
      justify-content: center !important;
      align-items: center;
      height: 34px;
      border: none;
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      transition: background-color 0.3s ease-out;
      transition: color 0.3s ease-out;

      .toggle-token-item-label .basic-typography-ellipsis {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
        max-width: 140px;
      }
    }

    .toggle-token-item-checked {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      background-color: ${({ theme }) =>
        theme.sharedTheme.basic.colorPrimaryBgActive};

      .toggle-token-item-label .basic-typography-ellipsis {
        color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorPrimary} !important;
      }
    }
  }

  &.scan-type-selector-disabled {
    .toggle-token-item-no-style {
      cursor: not-allowed;
      pointer-events: none;
    }
  }
`;

export const EmptyDataTipsStyleWrapper = styled('span')`
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
`;
