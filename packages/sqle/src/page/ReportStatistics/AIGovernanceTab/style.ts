import { styled } from '@mui/material/styles';

export const AIGovernanceTabStyleWrapper = styled('div')`
  padding: 20px 40px 30px;
  min-width: 880px;

  .ai-governance-title {
    margin: 0 0 20px;
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ai-governance-title-main {
    font-weight: 800;
    font-size: 30px;
    line-height: 1;
  }

  .ai-governance-title-icon {
    width: 22px;
    height: 22px;
    color: ${({ theme }) =>
      theme.sqleTheme.reportStatistics.AIGovernanceTab.titleIconColor};
  }

  .ai-governance-content {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
`;
