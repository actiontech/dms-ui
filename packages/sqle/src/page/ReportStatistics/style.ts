import { styled } from '@mui/material/styles';

export const ReportStatisticsEEIndexStyleWrapper = styled('section')`
  background-color: ${({ theme }) =>
    theme.sharedTheme.uiToken.colorFillTertiary};
`;

export const EEIndexStyleWrapper = styled('section')`
  padding: 60px 40px 30px;
  min-width: 880px;

  .marginTop20 {
    margin-top: 20px;
  }

  .item-wrapper {
    width: 100%;
    height: 100%;

    & .ant-card {
      .ant-card-body {
        padding: 20px;
      }
    }

    &.card-wrapper {
      height: 170px;
    }

    &.order-wrapper {
      height: 360px;
    }

    &.order-wrapper2 {
      height: 380px;
    }

    &.top-list-wrapper {
      height: 668px;
    }
  }
`;
