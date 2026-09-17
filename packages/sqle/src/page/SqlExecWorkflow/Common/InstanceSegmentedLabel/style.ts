import { styled } from '@mui/material';

export const InstanceSegmentedLabelStyleWrapper = styled('div')`
  display: inline-flex;
  align-items: center;

  &.instance-segmented-label {
    display: inline-flex;
    align-items: center;
  }

  .instance-segmented-label-icon {
    margin-left: 4px;
  }

  .instance-segmented-label-priority {
    margin-left: 4px;
    font-size: 12px;
    line-height: 1;
  }

  &.instance-segmented-label--error_P0 .instance-segmented-label-priority {
    color: #c41d3a;
  }

  &.instance-segmented-label--error_P1 .instance-segmented-label-priority {
    color: #fa8c16;
  }
`;
