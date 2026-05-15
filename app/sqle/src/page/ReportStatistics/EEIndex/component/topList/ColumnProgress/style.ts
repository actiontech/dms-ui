import { styled } from '@mui/material/styles';

export const ColumnProgressStyleWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .progress-line {
    position: relative;
    z-index: 1;
    border-radius: 10px;
    height: 6px;
    width: calc(100% - 4em);
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgLayout};

    .progress-bar {
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      height: 6px;
      border-radius: 10px;
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
    }
  }

  .progress-text {
    width: 5em;
    font-size: 13px;
    line-height: 20px;
    text-align: right;
  }
`;
