import { styled } from '@mui/material/styles';

export const DashboardNameStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  .custom-icon {
    margin-right: 12px;
  }
`;

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

export const NoBorderedPageHeaderWrapper = styled('div')`
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
