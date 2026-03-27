import { styled } from '@mui/material/styles';
import { Row } from 'antd';

export const MaintenanceTimePickerTagsWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;

  .ant-tag {
    width: 100%;
    max-width: 100%;
    margin-inline-end: 0 !important;
    justify-content: center;
    box-sizing: border-box;
    font-variant-numeric: tabular-nums;
  }
`;

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
