import { styled } from '@mui/material/styles';
import { BasicTag } from '@actiontech/shared';

export const DatabaseAccountListTagStyleWrapper = styled(BasicTag)`
  display: inline-flex;
  align-items: center;
  padding: 0 8px 0 6px !important;
  height: 28px !important;
  cursor: pointer;

  .name-ellipsis {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.more-tag {
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillSecondary} !important;
    border: 1px dashed
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary} !important;
    cursor: default;
  }
`;
