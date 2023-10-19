import { styled } from '@mui/material/styles';
import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { Space } from 'antd5';

export const OperationStatusStyleWrapper = styled(Space)`
  .${ANTD_PREFIX_STR}-space-item:first-of-type {
    display: flex;
  }
`;
