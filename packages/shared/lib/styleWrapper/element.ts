import { Row } from 'antd5';
import { BasicButton } from '../';
import { ANTD_PREFIX_STR } from '../data/common';
import { styled } from '@mui/material/styles';

/**
 * 使用介绍: packages/sqle/src/page/AuditPlan/PlanList/TableTaskTypeFilter/index.tsx
 */
export const FilterButtonStyleWrapper = styled(BasicButton)`
  &.${ANTD_PREFIX_STR}-btn-default.basic-button-wrapper.filter-btn {
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillTertiary};
    border-color: ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};

    span,
    .number-tag {
      font-style: normal;
      font-weight: 400;
    }

    span {
      font-size: 13px !important;
    }

    .number-tag {
      display: inline-block;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillSecondary};
      padding: 0 3px;
      border-radius: 3px;
      line-height: 18px;
      margin-left: 4px;
      font-size: 12px;
    }

    &:hover,
    &.checked-item {
      background-color: ${({ theme }) =>
        theme.sharedTheme.basic.colorPrimaryBgActive};
      border-color: ${({ theme }) =>
        theme.sharedTheme.basic.colorPrimaryBgActive};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};

      .number-tag {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        background-color: ${({ theme }) =>
          theme.sharedTheme.basic.colorPrimaryBgHover};
      }
    }

    &:disabled {
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
      border-color: ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};

      .number-tag {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
        background-color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorFillSecondary};
      }
    }
  }
`;

export const FilterButtonLabelStyleWrapper = styled('span')`
  border-radius: 4px;
  font-size: 13px !important;
  height: 28px;
  line-height: 28px;
  text-align: left;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
  margin-right: 10px;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
`;

export const PageLayoutHasFixedHeaderStyleWrapper = styled('section')`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const SegmentedRowStyleWrapper = styled(Row)`
  padding: 14px 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
`;

export const RuleStatusWrapperStyleWrapper = styled('div')`
  padding-right: 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
`;

export const PopconfirmMessageStyleWrapper = styled('span')`
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
`;

/**
 * 功能: 用于带有合并行的表格，处理被合并行第一列的样式问题
 * PS：合并列的情况暂时还没遇到，之后有使用场景了可再补充
 */
export const ConsolidatedListStyleWrapper = styled('section')`
  .${ANTD_PREFIX_STR}-table-wrapper.actiontech-table-namespace
    .${ANTD_PREFIX_STR}-table-tbody
    .${ANTD_PREFIX_STR}-table-row {
    .${ANTD_PREFIX_STR}-table-cell:first-of-type {
      padding-left: 16px;
    }
    .${ANTD_PREFIX_STR}-table-cell .consolidated-column {
      padding-left: 24px;
    }
  }
`;

/**
 * 功能: 用于带Icon的表格列，如工单号
 */
export const TableColumnWithIconStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  span {
    margin-right: 12px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

/**
 * 功能: 用于抽屉内表单的图标样式， 如RoleSelector的删除Icon
 */
export const DrawerFormIconWrapper = styled(BasicButton)`
  &.${ANTD_PREFIX_STR}-btn-default.${ANTD_PREFIX_STR}-btn-icon-only.basic-button-wrapper {
    height: 36px;
    width: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicSelect.default.border};
    box-shadow: none;

    &:hover {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.hover.border};
    }
  }
`;

/**
 * 功能: 用于FormList中的添加按钮
 */
export const FormListAddButtonWrapper = styled(BasicButton)`
  &.${ANTD_PREFIX_STR}-btn-default.basic-button-wrapper.form-list-add {
    background-color: ${({ theme }) =>
      theme.sharedTheme.basic.colorPrimaryBgHover} !important;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary} !important;
  }
`;
