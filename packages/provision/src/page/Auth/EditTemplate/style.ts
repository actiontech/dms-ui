import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';

export const AuthTemplateFormStyleWrapper = styled('div')`
  padding: 84px 40px 24px;

  .${ANTD_PREFIX_STR}-input-lg.basic-input-wrapper {
    padding: 0;
    font-size: 24px;

    &.${ANTD_PREFIX_STR}-input[disabled] {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
      cursor: default;
    }
  }

  .${ANTD_PREFIX_STR}-typography.selected-business-text {
    font-size: 13px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};

    &.has-selected {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    }
  }

  .tag-wrapper {
    display: flex;
    align-items: center;
    height: 28px;
    padding: 0 8px 0 6px;
    border-radius: 4px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

    .custom-icon {
      margin-right: 6px;
    }
  }
`;
