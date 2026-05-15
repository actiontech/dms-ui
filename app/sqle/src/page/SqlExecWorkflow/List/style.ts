import { styled } from '@mui/material/styles';
import { Typography } from 'antd';

export const SqlExecWorkflowListStyleWrapper = styled('section')`
  .workflow-list-table-desc-column {
    max-width: 400px;
  }

  .workflow-list-table-name-column {
    max-width: 300px;
  }
`;

export const WorkflowNameStyleWrapper = styled(Typography.Paragraph)`
  max-width: 100%;

  &.ant-typography.ant-typography-ellipsis {
    margin-bottom: 0;
  }
`;
