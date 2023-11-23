import { styled } from '@mui/material/styles';
import { Space } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

export const CloudBeaverContentStyleWrapper = styled('section')`
  padding: 30px 40px;
`;

export const CloudBeaverContentSpaceStyleWrapper = styled(Space)`
  width: 100%;
`;

export const CloudBeaverContentIconStyleWrapper = styled(WarningOutlined)`
  font-size: 50px;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorWarning} !important;
`;
