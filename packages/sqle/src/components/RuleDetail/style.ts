import { styled } from '@mui/material/styles';
import { Space } from 'antd';
import { CustomInputStyleWrapper } from '@actiontech/shared/lib/components/CustomInput/style';

export const HeaderSpaceTagStyleWrapper = styled(Space)`
  .tag-icon {
    border-radius: 3px;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.project-name-space {
    .project-flag-icon {
      background-color: ${({ theme }) =>
        theme.sqleTheme.statistics.rectColorName.color10}1a;

      * {
        color: ${({ theme }) =>
          theme.sqleTheme.statistics.rectColorName.color10} !important;
      }
    }
  }

  &.database-type-space {
    .database-type-icon {
      background-color: ${({ theme }) =>
        theme.sqleTheme.statistics.rectColorName.color5}1a;

      * {
        color: ${({ theme }) =>
          theme.sqleTheme.statistics.rectColorName.color5} !important;
      }
    }
  }
`;

export const RuleTemplateDetailStyleWrapper = styled('section')`
  .rule-template-basic-info {
    padding: 24px 40px;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

    .ruleTemplate-name {
      font-size: 24px;
      font-weight: 500;
      line-height: 32px;
    }

    .toolbar-wrapper {
      .ant-row {
        border: none;
        padding: 0;
      }
    }
  }
`;

export const RuleDetailCustomSearchInputStyleWrapper = styled(
  CustomInputStyleWrapper
)`
  &.ant-input-affix-wrapper.custom-search-input {
    width: 280px;
  }
`;

export const DetailComStyleWrapper = styled('section')`
  height: 100%;

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

      .refresh-icon {
        width: 28px;
        height: 28px;
        line-height: 28px;
        margin-left: 8px;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
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
        border: 1px solid
          ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
        margin-right: 8px;
        background-color: ${({ theme }) =>
          theme.sharedTheme.basic.colorWhite} !important;

        * {
          font-size: 13px;
          font-weight: 600;
          line-height: 20px;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
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

  .detail-table-wrapper {
    height: 100%;
    position: relative;

    .ant-spin-nested-loading {
      width: 100%;
    }

    .actiontech-table-namespace,
    .ant-spin-container,
    .ant-spin-nested-loading {
      height: 100%;
    }

    .actiontech-table-namespace {
      padding-bottom: 0;
    }

    .ant-spin-container {
      position: relative;
    }

    .ant-pagination {
      left: 220px !important;
      right: none !important;
      min-width: 730px;
    }
  }
`;
