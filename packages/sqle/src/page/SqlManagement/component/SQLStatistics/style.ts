import { styled } from '@mui/material/styles';

export const SQLStatisticsWrapper = styled('div')`
  padding: 20px 40px 4px;

  .card-wrapper {
    .ant-card-body {
      padding: 20px !important;
      display: flex;

      .cont-item {
        flex: 1;

        .num,
        .desc {
          display: block;
          text-align: center;
        }

        &:nth-of-type(2) {
          display: flex;
          align-items: center;
          width: 100%;

          &::before,
          &::after {
            content: '';
            display: block;
            height: 80%;
            width: 1px;
            background-color: ${({ theme }) =>
              theme.sharedTheme.uiToken.colorBorderSecondary};
          }

          > div {
            width: 100%;
          }
        }

        .num {
          font-size: 24px;
          font-weight: 700;
          line-height: 32px;

          &.total {
            color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
          }

          &.problem {
            color: ${({ theme }) => theme.sharedTheme.uiToken.colorWarning};
          }

          &.optimized {
            color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
          }
        }

        .desc {
          line-height: 20px;
          padding-top: 3px;
          font-size: 14px;
          font-weight: 300;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
        }
      }
    }
  }
`;
