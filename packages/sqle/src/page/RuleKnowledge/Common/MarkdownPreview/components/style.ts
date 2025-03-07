import { styled } from '@mui/material/styles';
import { BasicTag, SQLRenderer } from '@actiontech/shared';

export const LabelPreviewStyleWrapper = styled(BasicTag)`
  &.ant-tag {
    display: inline-block !important;
  }
`;

export const SqlDiffPreviewStyleWrapper = styled('div')`
  .diff-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    div {
      flex: 1;
      padding-left: 8px;
    }
  }
`;

export const SqlPreviewStyleWrapper = styled(SQLRenderer.Snippet)`
  padding: 8px;
`;
