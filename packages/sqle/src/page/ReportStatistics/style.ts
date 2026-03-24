import { styled } from '@mui/material/styles';

export const ReportStatisticsEEIndexStyleWrapper = styled('section')`
  background-color: ${({ theme }) =>
    theme.sharedTheme.uiToken.colorFillTertiary};

  .fixed-tabs-row {
    position: fixed;
    top: var(--notice-banner-height, 0);
    left: ${({ theme }) => theme.sharedTheme.nav.width}px;
    right: 0;
    width: calc(100% - ${({ theme }) => theme.sharedTheme.nav.width}px);
    z-index: 9;
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};

    .refresh-icon {
      width: 28px;
      height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      svg {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
        font-size: 16px;
      }
    }
  }

  .segmented-tabs-wrapper {
    .segmented-item-content {
      padding-top: 56px;
    }
  }
`;

export const EEIndexStyleWrapper = styled('section')`
  padding: 0 40px 30px;
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
