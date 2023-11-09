import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { styled } from '@mui/material/styles';

export const BasicInfoStyleWrapper = styled('div')<{
  gap: number;
  status?: WorkflowRecordResV2StatusEnum;
}>`
  display: flex;
  padding: 24px 40px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-bottom: 1px solid
    ${({ theme }) => theme.sqleTheme.order.common.basicInfo.borderColor};
  background: ${({ theme }) => theme.sqleTheme.order.common.basicInfo.bgColor};

  &.hasTopHeader {
    padding-top: 60px;
  }

  &.clearPaddingTop {
    padding-top: 0;
  }

  .order-base-info-status {
    position: relative;
    display: flex;
    height: 48px;
    width: 64px;
    justify-content: center;
    margin-bottom: 20px;

    .icon-order-status-wrapper {
      position: absolute;
      z-index: 9;
      color: ${({ theme, status }) =>
        status
          ? theme.sqleTheme.statistics.auditResultStatusColor[status]
          : theme.sqleTheme.statistics.auditResultStatusColor.wait_for_audit};
    }

    &-text {
      margin-top: 10px;
      z-index: 10;
      color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      line-height: 20px;
    }
  }

  .order-base-info-title {
    color: ${({ theme }) => theme.sqleTheme.order.common.basicInfo.titleColor};
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
    margin-bottom: ${({ gap }) => `${gap}px`};
  }

  .order-base-info-desc {
    color: ${({ theme }) => theme.sqleTheme.order.common.basicInfo.descColor};
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
  }
`;

export const AuditResultFilterContainerStyleWrapper = styled('div')`
  display: flex;
  padding: 20px 40px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-bottom: 1px solid
    ${({ theme }) => theme.sqleTheme.order.common.auditResultFilter.borderColor};
  background: ${({ theme }) =>
    theme.sqleTheme.order.common.auditResultFilter.bgColor};

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
        theme.sqleTheme.order.common.auditResultFilter.auditResultInfo
          .itemBgColor};

      &-text {
        color: ${({ theme }) =>
          theme.sqleTheme.order.common.auditResultFilter.auditResultInfo
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
          theme.sqleTheme.order.common.auditResultFilter.auditResultInfo
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
      ? theme.sqleTheme.order.common.auditResultFilter.options.activeBgColor
      : theme.sqleTheme.order.common.auditResultFilter.options.bgColor};
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
        ? theme.sqleTheme.order.common.auditResultFilter.options.textActiveColor
        : theme.sqleTheme.order.common.auditResultFilter.options.textColor};
  }

  .num {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: ${({ active, theme }) =>
      active
        ? theme.sqleTheme.order.common.auditResultFilter.options.numActiveColor
        : theme.sqleTheme.order.common.auditResultFilter.options.numColor};
  }
`;

export const InstanceSegmentedLabelStyleWrapper = styled('div')`
  .instance-segmented-label {
    display: flex;
    align-items: center;

    &-icon {
      margin-left: 4px;
    }
  }
`;

export const DownloadDropdownStyleWrapper = styled('div')`
  display: flex;
  width: 160px;
  padding: 6px;
  flex-direction: column;
  align-items: start;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) =>
      theme.sqleTheme.order.createOrder.auditResult.download.borderColor};
  background: ${({ theme }) =>
    theme.sqleTheme.order.createOrder.auditResult.download.bgColor};
  box-shadow: ${({ theme }) =>
    theme.sqleTheme.order.createOrder.auditResult.download.boxShadow};

  .download-record-item {
    cursor: pointer;
    display: flex;
    height: 32px;
    padding: 0 10px;
    align-items: center;
    align-self: stretch;
    overflow: hidden;
    color: ${({ theme }) =>
      theme.sqleTheme.order.createOrder.auditResult.download.itemColor};
    text-overflow: ellipsis;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    transition: background-color 0.3s;

    &:hover {
      border-radius: 4px;
      background: ${({ theme }) =>
        theme.sqleTheme.order.createOrder.auditResult.download.itemHoverColor};
    }

    &-icon {
      margin-right: 6px;
      color: ${({ theme }) =>
        theme.sqleTheme.order.createOrder.auditResult.download.itemIconColor};
    }
  }
`;

export const ToggleButtonStyleWrapper = styled('div')<{ active: boolean }>`
  height: 28px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid
    ${({ theme }) =>
      theme.sqleTheme.order.createOrder.auditResult.toggleButton.borderColor};
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ active, theme }) =>
    !!active
      ? theme.sqleTheme.order.createOrder.auditResult.toggleButton.activeColor
      : theme.sqleTheme.order.createOrder.auditResult.toggleButton.color};
  background: ${({ active, theme }) =>
    !!active
      ? theme.sqleTheme.order.createOrder.auditResult.toggleButton.activeBgColor
      : theme.sqleTheme.order.createOrder.auditResult.toggleButton.bgColor};
`;
