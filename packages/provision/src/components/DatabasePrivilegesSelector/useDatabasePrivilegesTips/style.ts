import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { styled } from '@mui/material';

export const DatabaseSchemaLabelStyleWrapper = styled(CommonIconStyleWrapper)`
  height: 100%;
  display: flex;
  align-items: center;

  svg {
    min-width: 18px;
  }

  .content {
    margin-left: 4px;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-word;
    line-height: 16px;
  }
`;
