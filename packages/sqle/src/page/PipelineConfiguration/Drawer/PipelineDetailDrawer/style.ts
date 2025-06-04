import { styled } from '@mui/material/styles';
import { Typography } from 'antd';

export const PipelineDetailModalStyleWrapper = styled('section')`
  &.focus-node-list .ant-drawer-content-wrapper {
    z-index: auto !important;
  }

  &.focus-node-list .node-list {
    position: relative;
    z-index: 1000;
  }
`;

export const PipelineDetailModalIntegrationInfoStyleWrapper = styled(
  Typography.Paragraph
)`
  white-space: pre-line;
`;
