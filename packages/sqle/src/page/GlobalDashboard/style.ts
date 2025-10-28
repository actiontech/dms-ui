import { FilterContainerStyleWrapper } from '@actiontech/shared/lib/components/ActiontechTable/components/style';
import { styled } from '@mui/material/styles';

export const GlobalDashboardFilterStyleWrapper = styled(
  FilterContainerStyleWrapper
)`
  & .ant-form.ant-form-horizontal {
    .ant-select-selector,
    .custom-search-input {
      font-size: 13px !important;
    }
  }

  & .custom-select-namespace {
    width: 280px;
  }
`;

export const PendingSqlTableStyleWrapper = styled('div')`
  .ant-tag {
    width: max-content;
  }
`;
