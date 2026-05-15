import { styled } from '@mui/material/styles';

export const ResourceOverviewStyleWrapper = styled('section')`
  background-color: ${({ theme }) =>
    theme.sharedTheme.uiToken.colorFillTertiary};
`;

export const ResourceOverviewDetailStyleWrapper = styled('div')`
  padding: 24px 0;

  .resource-overview-base-info-wrapper {
    padding: 0 40px;

    .resource-overview-base-info-chart-card {
      .ant-card-body {
        height: 330px;
      }
    }
  }

  .statistic-card-wrapper {
    display: flex;
    margin-bottom: 24px;

    .ant-space-item {
      flex: 1;
    }
  }

  .ant-card.statistic-card {
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
  padding: 0 40px 60px;

  .resource-detail-table-toolbar-card.ant-card {
    .ant-card-body {
      padding: 0;
    }
  }

  .actiontech-table-toolbar-namespace,
  .actiontech-table-filter-container-namespace {
    border: 0;
    border-radius: 8px;
  }

  .resource-detail-wrapper {
    margin-top: 24px;
  }

  .ant-card.resource-detail-table-card {
    .ant-card-body {
      padding: 0;
      margin-top: 1px;
    }
  }

  .no-project-tips.ant-tree-treenode {
    .ant-tree-switcher.ant-tree-switcher-noop {
      visibility: hidden;
    }
  }

  & .ant-btn-default.btn-active {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    background: ${({ theme }) => theme.sharedTheme.basic.colorPrimaryBgActive};
  }

  & .ant-table-wrapper.actiontech-table-namespace.cursor-pointer {
    padding-bottom: 0;

    .actiontech-table-pagination {
      border-radius: 8px;
    }
  }
`;
