import { styled } from '@mui/material/styles';
import { FilterContainerStyleWrapper } from '@actiontech/dms-kit/es/components/ActiontechTable/components/style';

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
