import { styled } from '@mui/material/styles';

export const AccountContentStyleWrapper = styled('div')`
  width: 640px;
  margin: 0 auto;
`;

export const AccountContentTitleStyleWrapper = styled('div')`
  padding: 60px 0 32px;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
  font-size: 24px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
`;
