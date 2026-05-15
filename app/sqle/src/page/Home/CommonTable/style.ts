import { styled } from '@mui/material/styles';

export const TableTitleStyleWrapper = styled('header')`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};

  .custom-icon {
    margin-right: 8px;
  }
`;

export const NoBorderedPageHeaderStyleWrapper = styled('div')`
  padding: 24px 40px 0;
  background-color: ${({ theme }) =>
    theme.sharedTheme.components.pageHeader.background};
`;

export const DashboardCommonListStyleWrapper = styled('section')`
  .dashboard-common-list-table-desc-column {
    max-width: 400px;
  }

  .dashboard-common-list-table-name-column {
    max-width: 280px;
  }
`;

export const CustomToolbarStyleWrapper = styled('div')`
  padding: 14px 40px;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid
    ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};

  .table-limit-tips-text {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
  }

  .custom-icon-refresh {
    cursor: pointer;
  }
`;
