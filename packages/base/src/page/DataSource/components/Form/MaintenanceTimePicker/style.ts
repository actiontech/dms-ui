import { styled } from '@mui/material/styles';
import { Row } from 'antd';

export const MaintenanceTimePickerPopoverWrapper = styled(Row)`
  width: 300px;

  .maintenance-time-picker-slider {
    width: 90%;
  }

  .maintenance-time-picker-btn-wrapper {
    text-align: right;
    margin-top: 5px;
  }
`;
