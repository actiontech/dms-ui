import { StyledComponent } from '@emotion/styled';
import { styled, Theme } from '@mui/material/styles';
import { MUIStyledCommonProps } from '@mui/system/createStyled';
import { TreeSelect, TreeSelectProps } from 'antd';

export const BasicTreeSelectStyleWrapper: StyledComponent<
  TreeSelectProps<any> & {
    children?: React.ReactNode;
  } & {
    ref?: React.Ref<any> | undefined;
  } & MUIStyledCommonProps<Theme>,
  {},
  {}
> = styled(TreeSelect<any>)`
  &.ant-select.basic-tree-select-wrapper {
    .ant-select-clear {
      width: 14px;
      height: 14px;
      font-size: 14px;
      margin: auto 0;
      margin-top: -7px;
      background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorFill};
      opacity: 1;

      .custom-icon-close {
        color: ${({ theme }) => theme.sharedTheme.basic.colorDefaultIcon};
      }
    }
  }

  &.basic-select-wrapper.ant-select:not(.ant-select-customize-input) {
    .ant-select-selector {
      border-radius: 4px;
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.default.border};
    }
  }

  .ant-select-selector > .ant-select-selection-placeholder {
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicSelect.default.placeholder.color};
  }

  &.ant-select:not(.ant-select-focused):not(.ant-select-status-error):not(
      .ant-select-disabled
    ):not(.ant-select-customize-input) {
    .ant-select-selector:hover {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.hover.border};
    }
  }

  &.ant-select-focused {
    .ant-select-selector {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.active.border};
    }
  }

  &.ant-select-disabled {
    .ant-select-selector {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.disabled.border};
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.disabled.background};
    }
  }

  &.ant-select-status-error {
    .ant-select-selector {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.error.border};
    }
  }
`;

export const BasicTreeSelectPopupMenuStyleWrapper = styled('div')`
  padding: 0 6px;
  width: 100%;

  .ant-select-tree-treenode {
    align-items: center !important;
    border-radius: 4px;
    padding: 2px !important;
    transition: background-color 0.3s ease-out;

    &:hover {
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
    }

    .ant-select-tree-switcher {
      width: 16px !important;
      display: flex;
      align-items: center;

      .ant-select-tree-switcher-icon {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      }
    }

    .ant-select-tree-node-content-wrapper {
      display: flex;
      align-items: center;

      &:hover {
        background-color: transparent !important;
      }
    }
  }

  .ant-select-tree-treenode-selected {
    transition: background-color 0.3s ease-out;
    background-color: ${({ theme }) =>
      theme.sharedTheme.basic.colorPrimaryBgHover};

    .ant-select-tree-node-selected {
      background-color: transparent !important;
    }
  }
`;
