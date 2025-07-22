import { styled } from '@mui/material/styles';
import { Space } from 'antd';

export const SqlInsightsStyleWrapper = styled('section')`
  padding-top: 116px;
`;

export const SegmentedStyleWrapper = styled(Space)`
  width: calc(100% - 220px);
  padding: 14px 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  position: fixed;
  right: 0;
  top: 60px;
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  z-index: 9;
  display: flex;
  justify-content: space-between;
`;
