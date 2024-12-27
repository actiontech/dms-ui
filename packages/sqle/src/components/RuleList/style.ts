import { BasicSegmented } from '@actiontech/shared';
import { Space } from 'antd';
import { styled } from '@mui/material/styles';
import { CustomInputStyleWrapper } from '@actiontech/shared/lib/components/CustomInput/style';

export const RuleStatusSegmentedStyleWrapper = styled(BasicSegmented)`
  .ant-segmented-item-selected.enabled-rule {
    color: ${({ theme }) =>
      theme.sharedTheme.components.ruleComponent.ruleStatus
        .enableColor} !important;
  }

  .ant-segmented-item-selected.disabled-rule {
    color: ${({ theme }) =>
      theme.sharedTheme.components.ruleComponent.ruleStatus
        .disabledColor} !important;
  }
`;

export const RuleTypeStyleWrapper = styled('div')`
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 20px 40px;
  align-content: center;
  align-self: stretch;
  width: 100%;
`;

export const RuleTypeItemStyleWrapper = styled('div')<{ active?: boolean }>`
  display: flex;
  height: 28px;
  padding: 0 8px;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  border: ${({ theme }) =>
    theme.sharedTheme.components.ruleComponent.ruleType.border};
  background: ${({ theme, active }) =>
    !!active
      ? theme.sharedTheme.components.ruleComponent.ruleType
          .activeBackgroundColor
      : theme.sharedTheme.components.ruleComponent.ruleType.backgroundColor};
  color: ${({ theme, active }) =>
    !!active
      ? theme.sharedTheme.components.ruleComponent.ruleType.activeColor
      : theme.sharedTheme.components.ruleComponent.ruleType.color};
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  transition: color 0.3s;
  transition: background-color 0.3s;

  &:not(:first-of-type) {
    margin-left: 8px;
  }

  .number-wrapper {
    display: inline-block;
    border-radius: 3px;
    background-color: ${({ theme, active }) =>
      !!active
        ? theme.sharedTheme.components.ruleComponent.ruleType
            .countActiveBackgroundColor
        : theme.sharedTheme.components.ruleComponent.ruleType
            .countBackgroundColor};
    padding: 0 3px;
    margin-left: 4px;
  }
`;

export const RulesStyleWrapper = styled('div')<{
  pageHeaderHeight: number;
  paddingBottomNone: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  height: ${({ pageHeaderHeight }) => `calc(100vh - ${pageHeaderHeight}px)`};
  padding: 10px 30px
    ${({ paddingBottomNone }) => (paddingBottomNone ? 0 : '8px')} 40px;
  overflow: hidden;

  .end-bottom-cont {
    width: 100%;
    padding: 16px 10px;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) =>
      theme.sharedTheme.components.ruleComponent.ruleList.endContentColor};
    text-align: center;
  }

  #rule-list-wrapper-id {
    width: 100%;
    height: 100%;
    padding-right: 10px;
    overflow-y: auto;

    .infinite-scroll-component {
      overflow: unset !important;
    }
  }
`;

export const RuleItemStyleWrapper = styled('div')`
  display: flex;
  padding: 16px 20px;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  border: ${({ theme }) =>
    theme.sharedTheme.components.ruleComponent.ruleList.border};
  background: ${({ theme }) =>
    theme.sharedTheme.components.ruleComponent.ruleList.backgroundColor};
  position: relative;

  &:not(:first-of-type) {
    margin-top: 12px;
  }

  &.has-top-margin {
    margin-top: 12px;
  }

  .level-icon {
    width: 40px !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-right: 16px;

    .level-icon-text {
      color: ${({ theme }) =>
        theme.sharedTheme.components.ruleComponent.ruleList.levelIconTextColor};
      font-size: 12px;
      font-weight: 500;
      line-height: 19px;
    }
  }

  .level-content {
    width: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 13px;

    &-desc.ant-typography {
      font-weight: 500;
      margin-bottom: 4px;
    }

    &-annotation.ant-typography {
      width: 100%;
      margin-bottom: 0;
      color: ${({ theme }) =>
        theme.sharedTheme.components.ruleComponent.ruleList.levelContent
          .annotationColor};
      font-size: 12px;
      font-weight: 400;
    }

    &-params {
      margin-top: 8px;
    }
  }

  .action-wrapper {
    position: absolute;
    right: -8px;
    top: -8px;

    .action-circle-btn {
      cursor: pointer;
      width: 24px !important;
      min-width: 24px !important;
      height: 24px !important;

      .anticon {
        font-weight: 700;
        font-size: 14px !important;
      }

      .icon-enabled {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
      }

      .icon-disabled {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
      }

      .icon-edit {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      }

      &.edit-rule-item {
        visibility: hidden;
      }
    }
  }

  &:hover {
    border: ${({ theme }) =>
      theme.sharedTheme.components.ruleComponent.ruleList.hoverBorder};
    background: ${({ theme }) =>
      theme.sharedTheme.components.ruleComponent.ruleList.hoverBackgroundColor};

    .action-wrapper {
      .action-circle-btn.edit-rule-item {
        visibility: visible;
      }
    }
  }
`;

export const RuleItemTagStyleWrapper = styled(Space)`
  display: flex;
  height: 22px;
  padding: 0 6px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 19px;

  &.rule-param-tag {
    border: 1px solid
      ${({ theme }) =>
        theme.sharedTheme.components.ruleComponent.ruleList.levelContent
          .paramsColor};
    color: ${({ theme }) =>
      theme.sharedTheme.components.ruleComponent.ruleList.levelContent
        .paramsColor};
  }

  &.rule-audit-tag {
    border: 1px solid
      ${({ theme }) =>
        theme.sharedTheme.components.basicTag.blue.backgroundColor};
    color: ${({ theme }) => theme.sharedTheme.components.basicTag.blue.color};
  }

  &.rule-rewrite-tag {
    border: 1px solid
      ${({ theme }) =>
        theme.sharedTheme.components.basicTag.green.backgroundColor};
    color: ${({ theme }) => theme.sharedTheme.components.basicTag.green.color};
  }

  &.rule-category-tag-wrap {
    .ant-space-item {
      display: flex;
      align-items: center;
    }
  }

  &.rule-category-sql {
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.components.basicTag.geekblue.color};
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicTag.geekblue.color};

    & .rule-category-active-tag {
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.basicTag.geekblue.color};
    }
  }

  &.rule-category-operand {
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.components.basicTag.purple.color};
    color: ${({ theme }) => theme.sharedTheme.components.basicTag.purple.color};

    & .rule-category-active-tag {
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.basicTag.purple.color};
    }
  }

  &.rule-category-audit_purpose {
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.components.basicTag.orange.color};
    color: ${({ theme }) => theme.sharedTheme.components.basicTag.orange.color};

    & .rule-category-active-tag {
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.basicTag.orange.color};
    }
  }

  &.rule-category-audit_accuracy {
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.components.basicTag.gray.color};
    color: ${({ theme }) => theme.sharedTheme.components.basicTag.gray.color};

    & .rule-category-active-tag {
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.basicTag.gray.color};
    }
  }

  .rule-category-active-tag {
    color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    padding: 0 4px;
    border-radius: 4px;
  }

  &.rule-detail-category {
    height: auto;
    align-items: flex-start !important;

    .ant-space-item:last-child {
      flex: 1;

      .ant-space-item {
        white-space: nowrap;
      }
    }
  }
`;

export const EmptyRuleStyleWrapper = styled('div')`
  display: flex;
  padding: 16px 10px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
`;

export const RuleFilterCustomInputStyleWrapper = styled(
  CustomInputStyleWrapper
)`
  width: 210px;
`;
