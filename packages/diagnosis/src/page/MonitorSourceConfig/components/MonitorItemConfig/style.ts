import { styled } from '@mui/material/styles';

export const MonitorConfigStyleWrapper = styled('section')`
  height: 100%;

  .header-wrapper {
    padding: 24px 40px;
    border-bottom: ${({ theme }) =>
      theme.diagnosisTheme.monitorSourceConfig.headerWrapper.borderBottom};

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      h3.header-cont-text {
        margin-bottom: 0;
        font-size: ${({ theme }) =>
          theme.diagnosisTheme.monitorSourceConfig.headerWrapper.title
            .fontSize};
        font-weight: ${({ theme }) =>
          theme.diagnosisTheme.monitorSourceConfig.headerWrapper.title
            .fontWeight};
        line-height: 32px;
        color: ${({ theme }) =>
          theme.diagnosisTheme.monitorSourceConfig.headerWrapper.title.color};
      }

      .refresh-icon {
        width: 28px;
        height: 28px;
        line-height: 28px;
        margin-left: 8px;
        color: ${({ theme }) =>
          theme.diagnosisTheme.monitorSourceConfig.headerWrapper.refreshIcon
            .color};
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .tag-wrapper {
      display: flex;
      align-items: center;

      .custom-tag-item {
        display: flex;
        align-items: center;
        height: 28px;
        padding: 0 8px 0 6px;
        border-radius: 4px;
        border: ${({ theme }) =>
          theme.diagnosisTheme.monitorSourceConfig.headerWrapper.tagWrapper
            .tagItem.border};
        margin-right: 8px;
        background-color: ${({ theme }) =>
          theme.diagnosisTheme.monitorSourceConfig.headerWrapper.tagWrapper
            .tagItem.backgroundColor} !important;

        &.custom-tag-primary {
          background-color: ${({ theme }) =>
            theme.diagnosisTheme.monitorSourceConfig.headerWrapper.tagWrapper
              .tagPrimary.primaryColor} !important;
          border-color: ${({ theme }) =>
            theme.diagnosisTheme.monitorSourceConfig.headerWrapper.tagWrapper
              .tagPrimary.primaryColor} !important;

          * {
            color: ${({ theme }) =>
              theme.diagnosisTheme.monitorSourceConfig.headerWrapper.tagWrapper
                .tagPrimary.hoverColor} !important;
          }
        }

        * {
          font-size: ${({ theme }) =>
            theme.diagnosisTheme.monitorSourceConfig.headerWrapper.tagWrapper
              .fontSize};
          font-weight: ${({ theme }) =>
            theme.diagnosisTheme.monitorSourceConfig.headerWrapper.tagWrapper
              .fontWeight};
          line-height: 20px;
          color: ${({ theme }) =>
            theme.diagnosisTheme.monitorSourceConfig.headerWrapper.tagWrapper
              .color};
        }

        .custom-icon {
          display: flex;
          justify-content: center;
          align-items: center;

          &.custom-tag-icon {
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 3px;
            margin-right: 6px;
          }

          &.bookmark-icon {
            background: ${({ theme }) =>
              theme.diagnosisTheme.monitorSourceConfig.headerWrapper.tagWrapper
                .icon.backgroundColor};
          }

          &.custom-tag-right-icon {
            margin-right: 0;
            margin-left: 6px;
          }

          &.cursor-pointer {
            cursor: pointer;
          }
        }
      }
    }
  }
`;
