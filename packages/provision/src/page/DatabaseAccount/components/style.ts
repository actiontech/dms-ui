import { styled } from '@mui/material/styles';
import { BasicTag } from '@actiontech/shared';
import { FormItemLabel } from '@actiontech/shared/lib/components/CustomForm';

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

export const PasswordFieldExtraStyleWrapper = styled('div')`
  margin: 8px 0 12px;

  .item {
    display: flex;
    align-items: center;

    .item-icon {
      margin-right: 4px;
      display: inline-flex;
      width: 16px;
      align-items: center;
    }
  }
`;

export const PasswordFieldStyleWrapper = styled(FormItemLabel)`
  .ant-form-item-explain.ant-form-item-explain-connected + div {
    min-height: 0;
    height: 0 !important;
  }

  .ant-form-item-extra {
    min-height: 0 !important;
  }
`;
