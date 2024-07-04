import { styled } from '@mui/material';

export const SqlStatusFilterContainerStyleWrapper = styled('div')`
  padding: 24px 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  display: flex;
  justify-content: space-between;
  align-items: center;

  & .sql-status-filter-option {
    display: flex;

    .custom-segmented-filter-item {
      &:not(:last-of-type) {
        margin-right: 8px;
      }

      cursor: pointer;
      display: flex;
      padding: 8px 16px;
      justify-content: center;
      border-radius: 4px;
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillTertiary};
      transition: background-color 0.3s ease-out;
      transition: color 0.3s ease-out;
      min-width: 100px;

      .sql-status-filter-item-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .sql-status-filter-number {
          font-weight: 900;
          font-size: 16px;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
          margin-bottom: 8px;
          text-align: center;
        }

        .sql-status-filter-text {
          font-size: 12px;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
        }
      }
    }

    .custom-segmented-filter-item-checked {
      background: ${({ theme }) =>
        theme.sharedTheme.basic.colorPrimaryBgActive};

      .sql-status-filter-item-wrapper {
        .sql-status-filter-number {
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        }

        .sql-status-filter-text {
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        }
      }
    }
  }

  & .sql-status-filter-extra {
    display: flex;
    flex-direction: column;
    align-items: end;

    .sql-status-filter-extra-tips {
      position: relative;
      margin-top: 8px;
      font-size: 12px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    }
  }
`;
