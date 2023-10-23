import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';

export const ProjectSelectorStyleWrapper = styled(CustomSelect)`
  &.${ANTD_PREFIX_STR}-select-lg.${ANTD_PREFIX_STR}-select.custom-project-selector {
    margin: 4px 0;

    .${ANTD_PREFIX_STR}-select-selector {
      font-size: 13px;
      font-weight: 500;
      overflow: hidden;

      .${ANTD_PREFIX_STR}-select-selection-placeholder,
        .${ANTD_PREFIX_STR}-select-selection-item {
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

    .${ANTD_PREFIX_STR}-select-arrow {
      .custom-icon-right-arrow-select-suffix {
        color: ${({ theme }) => theme.baseTheme.sideMenu.suffixIconColor};
      }
    }
  }
`;

export const ProjectSelectorLabelStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;

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

  .${ANTD_PREFIX_STR}-select-item-option-grouped {
    padding-inline-start: 12px;
  }

  .${ANTD_PREFIX_STR}-select-item-option-selected {
    .${ANTD_PREFIX_STR}-select-item-option-content {
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

    .${ANTD_PREFIX_STR}-btn {
      width: 208px;
      min-width: 64px;
      padding: 0 12px;
    }
  }
`;
