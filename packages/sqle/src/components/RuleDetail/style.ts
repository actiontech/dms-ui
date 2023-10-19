import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';
import { Space } from 'antd5';

export const HeaderSpaceTagStyleWrapper = styled(Space)`
  .tag-icon {
    border-radius: 3px;
    width: 20px;
    height: 20px;
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
      .${ANTD_PREFIX_STR}-row {
        border: none;
        padding: 0;
      }
    }
  }
`;
