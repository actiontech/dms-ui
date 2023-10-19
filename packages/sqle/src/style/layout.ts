import { styled } from '@mui/material/styles';

export const PageHeaderStyleWrapper = styled('section')`
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
`;
