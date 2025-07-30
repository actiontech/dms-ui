import { styled } from '@mui/material/styles';

export const LayoutContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

export const HeaderContainer = styled('header')`
  flex: 0 0 auto;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  z-index: 100;
  position: relative;
`;

export const MainContainer = styled('main')`
  flex: 1 1 auto;
  overflow: hidden;
  position: relative;
`;

// Header specific styled components
export const HeaderWrapper = styled('div')`
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background: #fff;
`;

export const HeaderLeft = styled('div')`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

export const HeaderRight = styled('div')`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  margin-left: auto;
`;

export const HeaderTitle = styled('h1')`
  margin: 0;
  padding: 0 16px;
  font-size: 18px;
  font-weight: 500;
  color: #000000d9;
  flex: 1 1 auto;
`;
