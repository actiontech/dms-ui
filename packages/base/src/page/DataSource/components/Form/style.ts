import { styled } from '@mui/material/styles';
import { Space } from 'antd';

export const FormCheckConnectableInfoModalWrapper = styled('div')`
  max-height: 500px;
  overflow-y: auto;
`;

export const SqlAuditFieldsSubTitleWrapper = styled(Space)`
  margin-bottom: 16px;

  h1.ant-typography {
    height: 30px !important;
    line-height: 30px !important;
  }
`;
