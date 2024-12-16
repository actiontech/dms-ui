import { styled } from '@mui/material';

export const EmptyContentStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px 10px;
  border-radius: 8px;
  border: 1px dashed
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

  .empty-icon {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
    margin-right: 16px;
    animation: breath 2s ease-in-out infinite;
  }

  .empty-text {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    font-size: 14px;
    line-height: 1.5;
  }

  @keyframes breath {
    0%,
    100% {
      opacity: 0.5;
    }

    50% {
      opacity: 1;
    }
  }
`;
