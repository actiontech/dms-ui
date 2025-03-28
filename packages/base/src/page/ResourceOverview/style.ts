import { styled } from '@mui/material/styles';

export const ResourceOverviewStyleWrapper = styled('div')`
  padding: 24px 0;

  .statistic-card-wrapper {
    display: flex;
    margin-bottom: 24px;
    padding: 0 40px;

    .ant-space-item {
      flex: 1;
    }
  }

  .ant-card.statistic-card {
    /* background-color: ${({ theme }) =>
      theme.sharedTheme.basic.colorWhite}; */

    .statistic-card-content {
      display: flex;
      align-items: center;

      .statistic-card-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        margin-right: 24px;
        background-color: ${({ theme }) =>
          theme.sharedTheme.basic.colorPrimaryBgHover};
      }
    }

    .ant-statistic-content {
      font-size: 24px;
      font-weight: 600;
    }
  }
`;

export const ResourceDetailWrapper = styled('div')`
  .actiontech-table-toolbar-namespace {
    border-top: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary} !important;
  }

  .resource-detail-wrapper {
    padding: 0 40px;
    margin-top: 24px;
  }

  .ant-card.resource-detail-table-card {
    .ant-card-body {
      padding: 0;
      margin-top: 1px;
    }
  }
`;
