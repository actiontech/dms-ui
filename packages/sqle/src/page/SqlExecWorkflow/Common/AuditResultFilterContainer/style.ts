import { styled } from '@mui/material';

export const AuditResultFilterContainerStyleWrapper = styled('div')`
  display: flex;
  padding: 20px 40px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.sqleTheme.execWorkflow.common.auditResultFilter.borderColor};
  background: ${({ theme }) =>
    theme.sqleTheme.execWorkflow.common.auditResultFilter.bgColor};

  &.audit-result-filter-container-mobile-wrapper {
    padding: 1rem;
    flex-direction: column;

    .custom-segmented-filter-wrapper {
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;

      .custom-segmented-filter-item {
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        margin-right: 0.5rem;
      }
    }
  }

  &.audit-result-filter-container-borderless {
    border-bottom: 0;
  }

  &.no-padding-style {
    padding: 0;
  }

  .audit-result-info {
    &-item {
      display: flex;
      padding: 8px 0;
      flex-direction: column;
      align-items: center;
      border-radius: 4px;
      background: ${({ theme }) =>
        theme.sqleTheme.execWorkflow.common.auditResultFilter.auditResultInfo
          .itemBgColor};

      &-text {
        color: ${({ theme }) =>
          theme.sqleTheme.execWorkflow.common.auditResultFilter.auditResultInfo
            .textColor};
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }

      &-value {
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
      }

      &-schema-value {
        color: ${({ theme }) =>
          theme.sqleTheme.execWorkflow.common.auditResultFilter.auditResultInfo
            .schemaValueColor};
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
      }

      &-value.audit-level-normal {
        color: ${({ theme }) =>
          theme.sqleTheme.statistics.auditRateStatus.success.color};
      }

      &-value.audit-level-error {
        color: ${({ theme }) =>
          theme.sqleTheme.statistics.auditRateStatus.error.color};
      }

      &-value.audit-level-notice {
        color: ${({ theme }) =>
          theme.sqleTheme.statistics.auditRateStatus.tip.color};
      }

      &-value.audit-level-warn {
        color: ${({ theme }) =>
          theme.sqleTheme.statistics.auditRateStatus.warning.color};
      }
    }
  }

  .audit-result-filter-option {
    display: flex;

    .custom-segmented-filter-item {
      &:not(:last-of-type) {
        margin-right: 8px;
      }

      cursor: pointer;
      display: flex;
      padding: 8px 16px;
      flex-direction: column;
      align-items: flex-start;
      align-items: center;
      border-radius: 4px;
      background: ${({ theme }) =>
        theme.sqleTheme.execWorkflow.common.auditResultFilter.options.bgColor};
      transition: background-color 0.3s;
      transition: color 0.3s;
      font-size: 12px;
      font-weight: 500;
      line-height: 20px;
      color: ${({ theme }) =>
        theme.sqleTheme.execWorkflow.common.auditResultFilter.options
          .textColor};
    }

    .custom-segmented-filter-item-checked {
      background: ${({ theme }) =>
        theme.sqleTheme.execWorkflow.common.auditResultFilter.options
          .activeBgColor};
      color: ${({ theme }) =>
        theme.sqleTheme.execWorkflow.common.auditResultFilter.options
          .textActiveColor};
    }
  }
`;

export const AuditResultFilterOptionsStyleWrapper = styled('div')<{
  active: boolean;
}>`
  cursor: pointer;
  display: flex;
  padding: 8px 16px;
  flex-direction: column;
  align-items: flex-start;
  align-items: center;
  border-radius: 4px;
  background: ${({ active, theme }) =>
    active
      ? theme.sqleTheme.execWorkflow.common.auditResultFilter.options
          .activeBgColor
      : theme.sqleTheme.execWorkflow.common.auditResultFilter.options.bgColor};
  font-weight: 700;
  line-height: 24px;
  transition: background-color 0.3s;
  transition: color 0.3s;

  .text {
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ active, theme }) =>
      active
        ? theme.sqleTheme.execWorkflow.common.auditResultFilter.options
            .textActiveColor
        : theme.sqleTheme.execWorkflow.common.auditResultFilter.options
            .textColor};
  }

  .num {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: ${({ active, theme }) =>
      active
        ? theme.sqleTheme.execWorkflow.common.auditResultFilter.options
            .numActiveColor
        : theme.sqleTheme.execWorkflow.common.auditResultFilter.options
            .numColor};
  }
`;
