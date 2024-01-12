import { styled } from '@mui/material/styles';

export const PageHeaderStyleWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 60px;
  background-color: ${({ theme }) =>
    theme.sharedTheme.components.pageHeader.background};
  border-bottom: ${({ theme }) =>
    theme.sharedTheme.components.pageHeader.borderBottom};

  .title {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: ${({ theme }) =>
      theme.sharedTheme.components.pageHeader.title.color};
  }

  .refresh-icon {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;

    svg {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      font-size: 16px;
    }
  }

  &.fixed-style {
    position: fixed;
    width: calc(100% - 220px);
    left: 220px;
    z-index: 9;
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.pageHeader.background};
  }
`;
