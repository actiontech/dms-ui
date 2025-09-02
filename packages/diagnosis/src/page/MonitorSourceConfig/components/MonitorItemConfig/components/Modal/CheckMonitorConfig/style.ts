import { BasicModal } from '@actiontech/shared';
import { styled } from '@mui/material/styles';

export const CheckMonitorConfigStyleWrapper = styled(BasicModal)`
  &.monitor-item-routine-modal.basic-modal-wrapper.ant-modal
    .ant-modal-content
    .ant-modal-body {
    padding: 0;

    .monitor-item-routine-table {
      padding-bottom: 8px;

      .ant-table-content {
        max-height: 450px;
        overflow-y: auto !important;
      }
    }
  }
`;
