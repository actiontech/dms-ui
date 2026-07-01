import { styled } from '@mui/material/styles';

export const RemediationDiffCompareStyleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .diff-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .diff-column {
    min-width: 0;
  }

  .diff-column-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .diff-column-title {
    margin: 0 !important;
    flex: 1;
    min-width: 0;
  }

  .diff-column-audit-time {
    flex-shrink: 0;
    font-size: 12px;
    line-height: 18px;
    text-align: right;
  }

  .diff-section {
    border-radius: 4px;
    border: 1px solid transparent;
    overflow: hidden;
  }

  .diff-section-optimized {
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.basicTag.green.backgroundColor};
    border-color: ${({ theme }) =>
      `${theme.sharedTheme.uiToken.colorSuccess}33`};
  }

  .diff-section-new {
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorWarningBgHover};
    border-color: ${({ theme }) =>
      `${theme.sharedTheme.uiToken.colorWarning}40`};
  }

  .diff-section-unchanged {
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillTertiary};
    border-color: transparent;
  }

  .diff-section-exempted {
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.basicTag.gray.backgroundColor};
    border-color: ${({ theme }) =>
      `${theme.sharedTheme.uiToken.colorTextSecondary}26`};
  }

  .diff-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 12px;
  }

  .diff-section-header-collapsible {
    cursor: pointer;
    user-select: none;

    &:hover {
      opacity: 0.88;
    }
  }

  .diff-section-header-main {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .diff-section-chevron {
    flex-shrink: 0;
    font-size: 12px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
  }

  .diff-section-collapsed .diff-section-header {
    padding-bottom: 8px;
  }

  .diff-section-title {
    font-size: 13px;
    line-height: 20px;
    font-weight: 500;
  }

  .diff-section-count {
    font-size: 12px;
    line-height: 18px;
  }

  .diff-section-body {
    padding: 0 12px 12px;
  }

  .diff-section-body-standalone {
    padding: 12px;
  }

  .diff-item {
    border-radius: 4px;
    padding: 4px 0;
    min-width: 0;
  }

  .diff-item-optimized {
    padding: 4px 8px;
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.basicTag.green.backgroundColor};
  }
`;
