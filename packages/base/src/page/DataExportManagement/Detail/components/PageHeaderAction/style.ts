import { styled } from '@mui/material/styles';

export const ExportDetailPageHeaderExtraStyleWrapper = styled('div')`
  display: flex;

  .export-detail-page-header-divider {
    margin: 0 12px 0 0 !important;
    height: 32px !important;
  }

  .basic-button-wrapper {
    margin-right: 12px;
  }

  .toggle-export-detail-wrapper {
    display: flex;
    height: 32px;
    min-width: 64px;
    padding: 0 12px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillSecondary};
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
  }
`;
