import { Row, Form } from 'antd';
import { BasicButton } from '../';
import { styled } from '@mui/material/styles';

/**
 * 使用介绍: packages/sqle/src/page/AuditPlan/PlanList/TableTaskTypeFilter/index.tsx
 */
export const FilterButtonStyleWrapper = styled(BasicButton)`
  &.ant-btn-default.basic-button-wrapper.filter-btn {
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
  .ant-table-wrapper.actiontech-table-namespace
    .ant-table-tbody
    .ant-table-row {
    .ant-table-cell:first-of-type {
      padding-left: 16px;
    }

    .ant-table-cell .consolidated-column {
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

  svg {
    margin-right: 12px;
  }

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
  &.ant-btn-default.ant-btn-icon-only.basic-button-wrapper {
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
  &.ant-btn-default.basic-button-wrapper.form-list-add {
    background-color: ${({ theme }) =>
      theme.sharedTheme.basic.colorPrimaryBgHover} !important;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary} !important;
  }
`;

/**
 * 功能: 用于Modal中带有提示信息的FormItem 如provision授权清单中的续期弹窗
 */
export const FormItemWithExtraStyleWrapper = styled(Form.Item)`
  &.ant-form-item .ant-form-item-extra {
    margin-top: 16px;
    padding: 4px 8px;
    border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillTertiary};
    font-size: 12px;
    line-height: 20px;
  }
`;

export const CommonIconStyleWrapper = styled('span')`
  display: inline-block;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizelegibility;
  -webkit-font-smoothing: antialiased;

  svg {
    display: inline-block;
  }

  * {
    line-height: 1;
  }

  &.custom-icon-spin-dot {
    position: absolute;
    top: 50%;
    inset-inline-start: 50%;
    margin: -10px;
  }
`;

/**
 * 一个开关按钮 style，某些情况可用以替换 Switch 使用
 */
export const ToggleButtonStyleWrapper = styled('div')<{
  active: boolean;
  disabled?: boolean;
  size?: 'lg' | 'sm';
}>`
  height: ${({ size, theme }) => {
    let height = theme.sharedTheme.basic.controlHeight;
    if (size === 'lg') {
      height = theme.sharedTheme.basic.controlHeightLG;
    } else if (size === 'sm') {
      height = theme.sharedTheme.basic.controlHeightSM;
    }
    return `${height}px`;
  }};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.sharedTheme.basic.borderRadius4 + 'px'};
  border: 0;
  font-size: 13px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) =>
    `0 1px 4px 0 ${theme.sharedTheme.basic.colorShadowByWhite}`};
  color: ${({ active, theme }) =>
    !!active
      ? theme.sharedTheme.uiToken.colorPrimary
      : theme.sharedTheme.uiToken.colorTextSecondary};
  background: ${({ active, theme }) =>
    !!active
      ? theme.sharedTheme.basic.colorPrimaryBgActive
      : theme.sharedTheme.basic.colorWhite};
  transition: all 0.3s;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(0, 0, 0, 0.15) 0%,
      transparent 100%
    );
    transform: scale(0);
    opacity: 0;
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  }

  &:active::before {
    transform: scale(2);
    opacity: 1;
    transition: 0s;
  }

  &:hover {
    opacity: 0.85;
  }
`;
