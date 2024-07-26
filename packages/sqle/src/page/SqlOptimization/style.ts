import { styled } from '@mui/material/styles';
import { Space } from 'antd';

export const SqlOptimizationOverviewBaseInfoStyleWrapper = styled('section')`
  width: 100%;
  padding: 0 40px 24px;

  .title-wrap {
    margin: 24px 0;
  }

  & .ant-table-wrapper.actiontech-table-namespace.optimization-sql-table {
    padding-bottom: 0;
  }

  & .last-title {
    padding-bottom: 60px;
  }
`;

export const SqlOptimizationSqlBlockStyleWrapper = styled('section')`
  padding: 24px;
  background-color: ${({ theme }) =>
    theme.sharedTheme.uiToken.colorFillTertiary};
  border-radius: 4px;

  div {
    align-items: center;
  }
`;

export const SqlOptimizationCodeBlockStyleWrapper = styled('section')`
  padding: 24px;
  background-color: ${({ theme }) =>
    theme.sharedTheme.uiToken.colorFillTertiary};
  border-radius: 4px;
  position: relative;

  & .copy-icon {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  & .code-wrapper {
    line-height: 20px;
    margin: 0;
  }
`;

export const SqlOptimizationDetailStyleWrapper = styled('section')`
  width: 100%;
  padding: 60px 40px 24px;

  & .title-wrap {
    margin: 24px 0;
  }

  & .sql-wrapper div {
    align-items: center;
  }

  .code-pre {
    white-space: pre-wrap;
  }

  & .detail-segmented {
    padding: 14px 0;
  }

  & .ant-space-horizontal.ant-space-align-center.full-width-element {
    padding: 14px 0;
    margin-bottom: 12px !important;
  }
`;

export const TriggeredRuleStyleWrapper = styled('section')`
  margin: 0 8px;

  & .rule-name {
    margin-bottom: 8px;
    display: block;
  }
`;

export const OptimizationStatusStyleWrapper = styled('section')`
  display: flex;
  align-items: center;

  span {
    &:last-of-type {
      margin-left: 8px;
    }
  }
`;

export const DetailComStyleWrapper = styled('section')`
  height: 100%;
  padding-top: 60px;

  .header-wrapper {
    padding: 24px 40px;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      h3.header-cont-text {
        margin-bottom: 0;
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
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
        border: 1px solid
          ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
        margin-right: 8px;
        background-color: ${({ theme }) =>
          theme.sharedTheme.basic.colorWhite} !important;

        div {
          font-size: 13px;
          font-weight: 600;
          line-height: 20px;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
        }

        .custom-icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .status-wrapper {
      margin-top: 12px;
      padding: 12px 8px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};

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
    }
  }
`;

export const HeaderSpaceTagStyleWrapper = styled(Space)`
  .tag-icon {
    border-radius: 3px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ant-space-item {
    display: flex;
  }

  &.project-name-space {
    .project-flag-icon {
      background-color: ${({ theme }) =>
        theme.sqleTheme.statistics.rectColorName.color10};

      * {
        color: ${({ theme }) =>
          theme.sqleTheme.statistics.rectColorName.color10} !important;
      }
    }
  }

  &.database-type-space {
    .database-type-icon {
      background-color: ${({ theme }) =>
        theme.sqleTheme.statistics.rectColorName.color5};

      * {
        color: ${({ theme }) =>
          theme.sqleTheme.statistics.rectColorName.color5} !important;
      }
    }
  }
`;
