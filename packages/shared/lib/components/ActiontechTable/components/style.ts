import { styled } from '@mui/material/styles';
import { Space } from 'antd';
import BasicInput from '../../BasicInput/Input';
import BasicRangePicker from '../../BasicRangePicker';

export const FilterContainerStyleWrapper = styled(Space)`
  border-bottom: ${({ theme }) =>
    theme.sharedTheme.components.filterContainer.border};
  background-color: ${({ theme }) =>
    theme.sharedTheme.components.filterContainer.backgroundColor};
  padding: 10px 40px;
  margin-bottom: 0 !important;

  & .ant-space-item {
    padding-bottom: 0 !important;
  }
`;

export const SearchInputStyleWrapper = styled(BasicInput)`
  .ant-input-suffix.basic-input-wrapper {
    margin-left: 0;
    padding: 0 4px;

    .custom-icon-search {
      cursor: pointer;
      color: ${({ theme }) =>
        theme.sharedTheme.components.searchInput.searchIconColor};
    }
  }
`;

export const ColumnsSettingDropdownStyleWrapper = styled('div')`
  width: 220px;
  background-color: ${({ theme }) =>
    theme.sharedTheme.components.columnsSetting.dropdown.backgroundColor};
  border-radius: 8px;
  padding: 8px 0;
  box-shadow: ${({ theme }) =>
    theme.sharedTheme.components.columnsSetting.dropdown.boxShadow};

  .actiontech-table-setting-fixed-left,
  .actiontech-table-setting-not-fixed {
    border-bottom: ${({ theme }) =>
      theme.sharedTheme.components.columnsSetting.dropdown.border};
  }

  .actiontech-table-setting-fixed-title {
    height: 36px;
    padding: 8px 20px;
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) =>
      theme.sharedTheme.components.columnsSetting.dropdown.title.color};
  }

  .columns-setting-item-wrapper {
    display: flex;
    align-items: center;
    height: 36px;
    padding: 0 12px 0 8px;

    &:hover {
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.columnsSetting.dropdown.item
          .hoverBackgroundColor};
    }

    &.drag-item-active {
      border: 1px solid ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }

    .fixed-options {
      display: flex;
      align-items: center;

      .fixed-icon {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        padding: 0 2px;
        margin: 0 2px;
        cursor: pointer;
      }
    }

    .columns-setting-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      width: 80%;
      padding: 4px 8px;

      .custom-icon-draggable {
        color: ${({ theme }) =>
          theme.sharedTheme.components.columnsSetting.dropdown.item.iconColor};
      }

      &-label {
        font-weight: 500;
        font-size: 13px;
        line-height: 20px;
        color: ${({ theme }) =>
          theme.sharedTheme.components.columnsSetting.dropdown.item.labelColor};
        overflow: hidden;
      }
    }
  }
`;

export const ToolbarStyleWrapper = styled(Space)`
  border-bottom: ${({ theme }) => theme.sharedTheme.components.toolbar.border};
  background-color: ${({ theme }) =>
    theme.sharedTheme.components.toolbar.backgroundColor};
  padding: 14px 40px;
  margin-bottom: 0 !important;

  .ant-space-item {
    padding-bottom: 0 !important;
  }
`;

export const CustomFilterRangePickerStyleWrapper = styled(BasicRangePicker)`
  &.ant-picker.ant-picker.basic-range-picker-wrapper {
    border: 1px solid
      ${({ theme }) =>
        theme.sharedTheme.components.customFilter.rangePicker
          .borderColor} !important;
    border-radius: 4px;
  }

  .ant-picker-input:first-of-type {
    width: 88%;
  }

  .ant-picker-active-bar {
    display: none;
  }

  .ant-picker-input {
    input {
      font-weight: 600;
    }

    input::placeholder {
      font-weight: 400;
      color: ${({ theme }) =>
        theme.sharedTheme.components.customFilter.rangePicker.placeholder
          .color} !important;
    }
  }

  &.ant-picker-range:not(.ant-picker-focused):hover {
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.customFilter.rangePicker
        .hoverBackgroundColor} !important;
  }

  &.ant-picker-focused {
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.customFilter.rangePicker
        .focusBackgroundColor} !important;
    border: 1px solid
      ${({ theme }) =>
        theme.sharedTheme.components.customFilter.rangePicker
          .borderColor} !important;
  }

  & .custom-range-picker-filter-label {
    color: ${({ theme }) =>
      theme.sharedTheme.components.customFilter.rangePicker.filterLabelColor};
  }
`;

export const InlineTableActionButtonsStyleWrapper = styled('div')`
  display: flex;

  .actiontech-table-actions-button {
    height: 24px;
    font-size: 12px !important;
  }

  .actiontech-table-actions-more-button {
    height: 24px;
    width: 24px;
    margin-left: 8px;
  }
`;

export const InlineTableActionMoreButtonPopoverStyleWrapper = styled('div')`
  width: 160px;
  padding: 6px;
  border-radius: 8px;
  background-color: ${({ theme }) =>
    theme.sharedTheme.components.table.row.moreButtonInActions.backgroundColor};
  color: ${({ theme }) =>
    theme.sharedTheme.components.table.row.moreButtonInActions.color};
  border: ${({ theme }) =>
    theme.sharedTheme.components.table.row.moreButtonInActions.border};
  box-shadow: ${({ theme }) =>
    theme.sharedTheme.components.table.row.moreButtonInActions.boxShadow};

  .more-button-item {
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 8px;
    border-radius: 4px;

    &:hover {
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.table.row.moreButtonInActions
          .hoverItemBackgroundColor};
    }

    &-text {
      font-size: 13px;
      font-weight: 500;
      line-height: 20px;
      margin-left: 8px;
    }

    &-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .more-button-item-disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.sharedTheme.basic.colorFontGrayByWhite};

    &:hover {
      background-color: inherit;
    }
  }
`;
