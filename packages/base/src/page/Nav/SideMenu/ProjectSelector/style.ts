import { CustomSelect } from '@actiontech/dms-kit';
import { CustomSelectPopupMenuStyleWrapper } from '@actiontech/dms-kit/es/components/CustomSelect/style';

import { styled } from '@mui/material/styles';

export const ProjectSelectorStyleWrapper = styled(CustomSelect)`
  &.ant-select-lg.ant-select.custom-project-selector {
    margin: 4px 0;

    .ant-select-selector {
      font-size: 13px;
      overflow: hidden;
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary} !important;

      .ant-select-selection-placeholder,
      .ant-select-selection-item {
        height: 34px;
      }

      .custom-select-option-content-prefix,
      .custom-select-placeholder-prefix {
        display: inline-flex;

        .project-flag-icon {
          color: ${({ theme }) =>
            theme.baseTheme.sideMenu.projectSelector.dropdown.activeIconColor};
        }
      }
    }

    .ant-select-arrow {
      .custom-icon-right-arrow-select-suffix {
        color: ${({ theme }) => theme.baseTheme.sideMenu.suffixIconColor};
      }
    }
  }
`;

export const ProjectSelectorLabelStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  &:hover {
    .project-flag-icon {
      color: ${({ theme }) =>
        theme.baseTheme.sideMenu.projectSelector.dropdown.activeIconColor};
    }
  }

  .project-flag-icon {
    color: ${({ theme }) =>
      theme.baseTheme.sideMenu.projectSelector.dropdown.iconColor};
    transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .project-selector-label-text {
    margin-left: 8px;
    color: ${({ theme }) =>
      theme.baseTheme.sideMenu.projectSelector.dropdown.labelColor};
  }
`;

export const ProjectSelectorPopupMenuStyleWrapper = styled('div')`
  padding: 0 0 16px;
  width: 100%;

  .select-options-group-label {
    padding: 8px 8px 4px 16px;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) =>
      theme.baseTheme.sideMenu.projectSelector.dropdown.groupLabelColor};
  }

  .ant-select-item-option-grouped {
    padding-inline-start: 12px;
  }

  .ant-select-item-option-selected {
    .ant-select-item-option-content {
      .project-flag-icon {
        color: ${({ theme }) =>
          theme.baseTheme.sideMenu.projectSelector.dropdown.activeIconColor};
      }
    }
  }

  .show-more-project-wrapper {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: center;

    .ant-btn {
      width: 208px;
      min-width: 64px;
      padding: 0 12px;
    }
  }
`;

export const MockSelectItemOptionsStyleWrapper = styled(
  CustomSelectPopupMenuStyleWrapper
)`
  max-height: 120px;
  overflow-y: auto;
`;
