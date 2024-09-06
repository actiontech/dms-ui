import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { styled } from '@mui/material/styles';

export const SqlManagementTableStyleWrapper = styled(ActiontechTable)`
  .ant-table-body {
    max-height: calc(100vh - 338px) !important;
  }

  .audit-status .ant-tag {
    width: fit-content;
  }
`;
