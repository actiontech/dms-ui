import { styled } from '@mui/material/styles';
import { Popover } from 'antd';

export const ChartTooltipStyleWrapper = styled('div')`
  &.tooltip-box-wrapper {
    padding: 6px 0 10px;
    min-width: 130px;

    header.tooltip-title {
      height: auto;
      min-height: 28px;
      line-height: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      margin-bottom: 6px;
    }

    header.tooltip-title span.dot,
    dl.tooltip-list span.dot {
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }

    dl.tooltip-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 20px;
      margin: 0;
      font-weight: 400;
      font-size: 12px;

      &:first-of-type {
        margin-top: 4px;
      }

      .tooltip-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .tooltip-value {
        font-weight: 600;
        margin-bottom: 0;
      }
    }
  }
`;

export const PopoverTooltipStyleWrapper = styled(Popover)`
  &.popover-tooltip-custom-chart {
    padding: 0;
  }
`;
