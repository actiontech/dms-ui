import { styled } from '@mui/material/styles';

export const SQLRendererStyleWrapper = styled('div')`
  &.actiontech-sql-snippet-renderer-wrapper,
  .actiontech-sql-renderer-wrapper {
    display: flex;
    max-width: 100%;

    span {
      font-family: 'SF Mono', 'PlusJakartaSans Medium', -apple-system,
        'Microsoft YaHei', BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' !important;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    }

    .code-line {
      height: 26px;
      line-height: 26px;

      .code-line-number {
        display: inline-block;
        width: 24px;
        text-align: center;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
        user-select: none;
      }
    }

    .actiontech-sql-renderer-copy-icon {
      height: 18px;
      width: 18px;
      border-radius: 4px;
      margin-inline-start: 10px;
      padding-inline-start: 2px;

      &:hover {
        opacity: 1;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        background-color: ${({ theme }) =>
          theme.sharedTheme.basic.colorPrimaryBgHover} !important;
      }
    }
  }

  &.actiontech-sql-snippet-renderer-wrapper.copy-icon-hover,
  .actiontech-sql-renderer-wrapper.copy-icon-hover {
    .actiontech-sql-renderer-copy-icon {
      opacity: 0;
    }
  }

  &.actiontech-sql-snippet-renderer-wrapper.copy-icon-hover:hover,
  .actiontech-sql-renderer-wrapper.copy-icon-hover:hover {
    .actiontech-sql-renderer-copy-icon {
      opacity: 1;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }
  }
`;
