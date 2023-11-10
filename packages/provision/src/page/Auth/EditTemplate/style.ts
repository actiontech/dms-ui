import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';

export const AuthTemplateFormStyleWrapper = styled('div')`
  padding: 84px 40px 24px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

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

export const EditAuthTemplateStyleWrapper = styled('section')`
  .table-toolbar-title {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }

  .${ANTD_PREFIX_STR}-empty.is-icon-tips {
    .${ANTD_PREFIX_STR}-empty-description .no-data-cont {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicEmpty.title.color};
      font-size: ${({ theme }) =>
        theme.sharedTheme.components.basicEmpty.title.fontSize};
      font-weight: ${({ theme }) =>
        theme.sharedTheme.components.basicEmpty.title.fontWeight};
    }

    .${ANTD_PREFIX_STR}-empty-footer {
      margin-top: 0;

      .${ANTD_PREFIX_STR}-typography.extra-tips {
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicEmpty.info.color};
        font-size: ${({ theme }) =>
          theme.sharedTheme.components.basicEmpty.info.fontSize};
        font-weight: ${({ theme }) =>
          theme.sharedTheme.components.basicEmpty.info.fontWeight};
        margin-bottom: 16px;
      }
    }
  }
`;
