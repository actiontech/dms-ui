import { styled } from '@mui/material/styles';

export const AggregatePageStyleWrapper = styled('div')`
  padding: 0 24px 36px;
  min-width: 900px;

  .aggregate-page-subtitle {
    margin-top: 4px;
    font-size: 13px;
    line-height: 20px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  }

  .aggregate-project-pill {
    display: inline-flex;
    align-items: center;
    padding: 2px 9px;
    border-radius: 12px;
    background: #e8f3ff;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    font-size: 12px;
    line-height: 18px;
  }
`;

export const AggregateFilterStyleWrapper = styled('section')`
  margin-top: 76px;
  display: grid;
  /* HTML .filter-card：单行五列，汇总方式窄列 165px */
  grid-template-columns:
    165px minmax(300px, 1.2fr) minmax(170px, 0.6fr) minmax(220px, 0.8fr)
    auto;
  gap: 20px;
  align-items: end;
  padding: 18px 20px;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  border-radius: 6px;
  background: #fff;

  .aggregate-filter-field {
    min-width: 0;

    /* records：中间三列合并为选人器（HTML .record-picker-field span 3） */
    &.record-picker-field {
      grid-column: span 3;
    }

    .ant-form-item {
      margin-bottom: 0;
    }

    .ant-form-item-row {
      flex-direction: column;
      align-items: stretch;
      row-gap: 8px;
    }

    .ant-form-item-label {
      padding: 0;
      text-align: left;
      width: 100%;
      max-width: 100%;
      height: auto;
      line-height: 20px;

      > label {
        width: 100%;
        height: 20px;
        line-height: 20px;
        justify-content: flex-start;
        font-size: 13px;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      }

      /* 无冒号（与 colon={false} 双保险） */
      > label::after {
        content: none !important;
      }
    }

    .ant-form-item-control {
      width: 100%;
      max-width: 100%;
      min-height: 0;
    }

    .ant-picker,
    .ant-select-selector,
    .record-picker-trigger {
      min-height: 34px;
    }

    .ant-picker {
      width: 100%;
    }
  }

  .aggregate-date-range {
    display: grid;
    grid-template-columns: 1fr 16px 1fr;
    gap: 8px;
    align-items: center;
    width: 100%;
  }

  .aggregate-date-range-sep {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    text-align: center;
    font-size: 13px;
    line-height: 34px;
  }

  .aggregate-tags-help {
    margin: 0;
    padding: 8px 12px;
    border-top: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-size: 12px;
    line-height: 18px;
  }

  .aggregate-filter-actions {
    display: flex;
    gap: 8px;
    white-space: nowrap;
    justify-content: flex-end;
    /* 网格 align-items:end 已与控件底对齐，无需 margin-top hack */
  }
`;

export const AggregateResultStyleWrapper = styled('section')`
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 24px;

  .aggregate-card {
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    border-radius: 6px;
    background: #fff;
  }

  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 16px;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    font-size: 14px;
    font-weight: 550;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};

    .section-hint {
      font-size: 12px;
      font-weight: 400;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    }
  }

  .report-meta {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px 24px;
    padding: 14px 18px;
  }

  .report-meta-label {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-size: 12px;
    line-height: 18px;
  }

  .report-meta-value {
    margin-top: 3px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 13px;
    line-height: 20px;
    word-break: break-word;
  }

  .aggregate-overview {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    min-height: 94px;
  }

  .metric {
    position: relative;
    padding: 17px 20px;
  }

  .metric + .metric::before {
    content: '';
    position: absolute;
    left: 0;
    top: 18px;
    bottom: 18px;
    width: 1px;
    background: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorBorderSecondary};
  }

  .metric-label {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-size: 12px;
    line-height: 18px;
  }

  .metric-value {
    margin-top: 3px;
    font-size: 28px;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    line-height: 36px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
  }

  .metric-note {
    margin-left: 6px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-size: 12px;
    font-weight: 400;
  }

  .aggregate-result-error {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding: 24px 20px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
    font-size: 14px;
    line-height: 22px;
  }

  .aggregate-content-card {
    min-height: 410px;
  }

  .aggregate-content-tabs.ant-tabs {
    .ant-tabs-nav {
      margin: 0;
      padding: 0 18px;
      height: 48px;

      &::before {
        border-bottom-color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorBorderSecondary};
      }
    }

    .ant-tabs-tab {
      padding: 12px 0;
      font-size: 14px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    }

    .ant-tabs-tab-active .ant-tabs-tab-btn {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      font-weight: 550;
    }

    .ant-tabs-ink-bar {
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }

    .ant-tabs-content-holder {
      padding: 0;
    }

    .tab-count {
      margin-left: 6px;
      padding: 0 6px;
      border-radius: 8px;
      background: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillQuaternary};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      font-size: 11px;
      font-weight: 400;
    }
  }

  .aggregate-state {
    min-height: 330px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 24px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    text-align: center;

    strong {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      font-size: 15px;
      font-weight: 550;
    }

    span {
      font-size: 13px;
      line-height: 20px;
      max-width: 420px;
    }
  }

  .aggregate-sqls-section,
  .aggregate-rules-section {
    padding: 0 0 8px;
  }

  @media (max-width: 1100px) {
    .report-meta {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .aggregate-overview {
      grid-template-columns: 1fr;
    }

    .metric + .metric::before {
      display: none;
    }
  }
`;

export const RecordPickerStyleWrapper = styled('div')`
  width: 100%;

  .record-picker-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: auto;
    min-height: 34px;
    padding: 4px 12px;
    text-align: left;
  }

  .record-picker-trigger-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
  }

  .record-picker-trigger-action {
    flex-shrink: 0;
    margin-left: 12px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
  }

  .record-picker-modal-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
  }

  .record-picker-modal-hint {
    margin: 0 0 12px;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  }

  .record-picker-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;

    .basic-input-wrapper,
    .ant-input-affix-wrapper,
    input {
      flex: 1 1 240px;
      min-width: 200px;
    }
  }

  /* 固定高度：候选再多也不撑破弹层 / 侵占条件区；配合页内分页减少 DOM */
  .record-picker-list {
    height: 360px;
    max-height: 360px;
    overflow: auto;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    border-radius: 4px;
  }

  .record-picker-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }

  .record-picker-option {
    display: grid;
    grid-template-columns: 24px minmax(140px, 1.2fr) minmax(140px, 1.4fr) minmax(
        100px,
        0.8fr
      );
    gap: 12px;
    align-items: start;
    padding: 12px 14px;
    margin: 0;
    cursor: pointer;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillQuaternary};
    }
  }

  .record-picker-option-main,
  .record-picker-option-side {
    min-width: 0;
    font-size: 13px;
    line-height: 20px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
  }

  .record-picker-id {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
    font-size: 13px;
    word-break: break-all;
  }

  .record-picker-sub {
    margin-top: 2px;
    font-size: 12px;
    line-height: 18px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  }

  .record-picker-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
  }

  .record-picker-empty {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    padding: 24px 12px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
  }

  .record-picker-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    gap: 12px;
  }

  .record-picker-count {
    margin-right: auto;
    font-size: 13px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
  }
`;

export const AggregateExportModalStyleWrapper = styled('div')`
  .export-meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 24px;
    margin-bottom: 16px;
    padding: 12px 14px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    border-radius: 4px;
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillQuaternary};
  }

  .export-meta-item {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .export-meta-label {
    font-size: 12px;
    line-height: 18px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  }

  .export-meta-value {
    font-size: 13px;
    line-height: 20px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    word-break: break-all;
  }

  .export-fields-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .export-fields-title {
    font-size: 13px;
    font-weight: 600;
    line-height: 20px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
  }

  .export-fields-hint {
    margin: 0 0 10px;
    font-size: 12px;
    line-height: 18px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  }

  .export-fields-empty {
    margin: 0 0 12px;
    padding: 12px;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    border: 1px dashed
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    border-radius: 4px;
  }

  .export-field-row {
    display: grid;
    grid-template-columns: minmax(120px, 0.9fr) minmax(160px, 1.2fr) auto;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }

  .export-field-actions {
    display: flex;
    flex-wrap: nowrap;
    gap: 4px;
  }

  .export-filename {
    margin-top: 14px;
    padding: 10px 12px;
    border-radius: 4px;
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillQuaternary};
  }

  .export-filename-label {
    margin-bottom: 4px;
    font-size: 12px;
    line-height: 18px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  }

  .export-filename-value {
    font-size: 13px;
    line-height: 20px;
    word-break: break-all;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
  }
`;
