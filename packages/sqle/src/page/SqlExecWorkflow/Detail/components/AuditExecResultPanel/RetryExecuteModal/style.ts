import { styled } from '@mui/material';
import { BasicModal } from '@actiontech/shared';
import { Typography } from 'antd';

export const RetryExecuteModalStyleWrapper = styled(BasicModal)`
  & .ant-modal-body {
    padding: 0 !important;

    .ant-table-wrapper.actiontech-table-namespace {
      padding-bottom: 0;
    }
  }
`;

export const RetryExecuteModalTitleDescStyleWrapper = styled(Typography.Text)`
  font-weight: 100;
`;
