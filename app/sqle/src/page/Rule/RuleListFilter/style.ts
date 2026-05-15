import { styled } from '@mui/material';

export const RuleListFilterStyleWrapper = styled('div')`
  width: 100%;
  padding: 16px 40px;
  border-radius: 8px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
`;
