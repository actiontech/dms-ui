import { styled } from '@mui/material/styles';

export const LayoutStyleWrapper = styled('section')`
  display: flex;
  min-height: 100vh;
  width: 100%;

  .dms-layout-side {
    flex: 0 0 ${({ theme }) => theme.baseTheme.sideMenu.width}px;
  }

  .dms-layout-content {
    flex: 1 1 calc(100% - ${({ theme }) => theme.baseTheme.sideMenu.width}px);
    min-width: 1060px;
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
    overflow: hidden;
  }
`;
