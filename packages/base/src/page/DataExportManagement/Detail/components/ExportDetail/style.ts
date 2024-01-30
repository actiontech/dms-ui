import { styled } from '@mui/material/styles';

export const WorkflowDetailExportResultStyleWrapper = styled('section')`
  margin-top: 40px;

  .export-result-title {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    padding: 0 40px;
  }

  .ant-space.export-result-actions-wrap {
    .ant-divider.export-result-actions-divider {
      margin: 0;
      height: 28px;
    }
  }
`;
