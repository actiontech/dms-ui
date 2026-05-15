import { styled } from '@mui/material/styles';

export const CardSectionTitleStyleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .card-section-title-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .card-section-title-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .top-problem-distribution-icon {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorWarning};
    }
  }

  .card-section-title-text {
    color: ${({ theme }) =>
      theme.sqleTheme.reportStatistics.ManagementView.cardSectionTitle
        .titleColor};
    font-weight: 700;
    font-size: 18px;
    line-height: 1.4;
  }

  .card-section-title-desc {
    color: ${({ theme }) =>
      theme.sqleTheme.reportStatistics.ManagementView.cardSectionTitle
        .descColor};
    font-size: 12px;
    line-height: 1.4;
  }
`;
