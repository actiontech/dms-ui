import { styled } from '@mui/material/styles';

export const RenderSQLStyleWrapper = styled('div')`
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

  .actiontech-copy {
    height: 18px;
    width: 18px;
    opacity: 0;
    border-radius: 4px;
    margin-inline-start: 10px;

    &:hover {
      opacity: 1;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      background-color: ${({ theme }) =>
        theme.sharedTheme.basic.colorPrimaryBgHover} !important;
    }
  }

  &:hover {
    .actiontech-copy {
      opacity: 1;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }
  }
`;
