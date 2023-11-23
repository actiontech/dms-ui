import { styled } from '@mui/material/styles';

export const AuthTemplateFormStyleWrapper = styled('div')`
  padding: 84px 40px 24px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

  .ant-input-lg.basic-input-wrapper {
    padding: 0;
    font-size: 24px;

    &.ant-input[disabled] {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
      cursor: default;
    }
  }

  .ant-typography.selected-business-text {
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

  .ant-empty.is-icon-tips {
    .ant-empty-description .no-data-cont {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicEmpty.title.color};
      font-size: ${({ theme }) =>
        theme.sharedTheme.components.basicEmpty.title.fontSize};
      font-weight: ${({ theme }) =>
        theme.sharedTheme.components.basicEmpty.title.fontWeight};
    }

    .ant-empty-footer {
      margin-top: 0;

      .ant-typography.extra-tips {
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
