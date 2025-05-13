import { styled } from '@mui/material/styles';
import { BasicTag } from '@actiontech/shared';

export const MemberGroupTagStyleWrapper = styled(BasicTag)`
  background-color: ${({ theme }) =>
    theme.sharedTheme.basic.colorPrimaryHover} !important;
  color: ${({ theme }) => theme.sharedTheme.basic.colorWhite} !important;
  cursor: pointer;
  height: 28px !important;
`;

export const MemberGroupTooltipContentWrapper = styled('div')`
  padding: 4px 0;

  .member-group-name-wrapper {
    display: grid;
    grid-template-columns: 16px 1fr;
    align-items: center;
    margin-bottom: 8px;

    .member-group-name-wrapper-text {
      margin-left: 4px;
    }
  }

  .user-name-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 16px;

    .user-name-wrapper-item {
      display: flex;
      align-items: center;
      min-width: 40px;

      &:not(:last-of-type) {
        margin-right: 12px;
      }

      .user-name-wrapper-item-text {
        margin-left: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`;
