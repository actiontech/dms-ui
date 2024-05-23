import { styled } from '@mui/material';

export const TasksResultCardStyleWrapper = styled('div')`
  width: 100%;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  margin-bottom: 20px;

  & .result-card-header {
    height: 60px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;

    .number {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      margin-right: 0 12px 0 4px;
    }

    .result-card-status-wrap {
      display: flex;
      margin-left: 4px;

      .result-card-status-divider {
        height: 28px;
        margin: 0 12px 0 4px;
      }
    }
  }

  & .result-card-content {
    padding: 16px 20px;

    .result-card-content-options {
      display: flex;
      justify-content: space-between;
    }

    & .ant-collapse.result-record-collapse .ant-collapse-header {
      padding: 8px 0;

      .ant-collapse-header-text {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
        font-weight: 500;
      }
    }
  }

  .file-result-collapse-wrapper {
    .ant-collapse-header {
      align-items: center !important;
      padding: 0 0 0 12px !important;
    }

    .file-result-card-wrapper {
      cursor: pointer;

      .file-info {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-name {
          margin-left: 8px;
        }
      }
    }
  }

  .result-card-footer {
    padding: 16px 20px;
    border-top: 1px solid
      ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
  }
`;

export const TaskResultSqlOptionsStyleWrapper = styled('div')<{
  active: boolean;
}>`
  cursor: pointer;
  padding: 0 12px;
  border-radius: 4px;
  background: ${({ active, theme }) =>
    active
      ? theme.sharedTheme.basic.colorPrimaryBgActive
      : theme.sharedTheme.basic.colorBgLayoutGray};
  height: 28px;
  line-height: 28px;
  color: ${({ active, theme }) =>
    active
      ? theme.sharedTheme.uiToken.colorPrimary
      : theme.sharedTheme.uiToken.colorTextTertiary};
  margin-right: 4px;
`;
