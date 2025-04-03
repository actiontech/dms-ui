import { styled } from '@mui/material/styles';

export const BusinessSelectStyleWrapper = styled('div')`
  .business-list {
    padding: 8px;
    border-top: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  }

  .business-item {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
    }

    .view-mode {
      width: 100%;
      justify-content: space-between;
    }

    .edit-mode {
      width: 100%;
    }

    .action-icon {
      cursor: pointer;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};

      &:hover {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      }
    }
  }

  .add-business {
    padding: 8px;
    cursor: pointer;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
    }
  }
`;
