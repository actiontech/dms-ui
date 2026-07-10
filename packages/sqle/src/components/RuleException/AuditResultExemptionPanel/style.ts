import { styled } from '@mui/material/styles';

export const AuditResultExemptionPanelStyleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const CollapsibleExemptedSectionDiffStyleWrapper = styled('div')`
  .diff-section-exempted {
    border-radius: 4px;
    border: 1px solid transparent;
    overflow: hidden;
    background-color: ${({ theme }) =>
      theme.sharedTheme.basic.colorPrimaryBgActive};
    border-color: ${({ theme }) =>
      `${theme.sharedTheme.uiToken.colorPrimary}33`};
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
`;

export const CollapsibleExemptedSectionReportStyleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .report-exempted-section-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;
