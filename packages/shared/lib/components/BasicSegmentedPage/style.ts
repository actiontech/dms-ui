import { styled } from '@mui/material/styles';
import { Space } from 'antd';

export const SegmentedPageStyleWrapper = styled(Space)`
  border-bottom: ${({ theme }) => theme.sharedTheme.components.toolbar.border};
  background-color: ${({ theme }) =>
    theme.sharedTheme.components.toolbar.backgroundColor};
  padding: 14px 40px;
  width: 100%;
`;
