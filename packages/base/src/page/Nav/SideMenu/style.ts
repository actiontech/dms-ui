import { styled } from '@mui/material/styles';
import { Space } from 'antd';
import { BasicModal } from '@actiontech/shared';
import { NotificationFilled } from '@ant-design/icons';

export const VersionModalFeatureContentStyleWrapper = styled(Space)`
  & .ant-space-item {
    width: 100%;
  }
`;

export const CEModeProjectWrapperStyleWrapper = styled('div')`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 8px;
  height: 36px;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  border-radius: 4px;
  margin: 4px 0;
  background-color: ${({ theme }) =>
    theme.sharedTheme.uiToken.colorFillTertiary} !important;
  font-weight: 500 !important;

  .project-flag-icon {
    margin-right: 8px;
    color: ${({ theme }) =>
      theme.baseTheme.sideMenu.projectSelector.dropdown.activeIconColor};
  }

  .ant-typography.default-project-name {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
  }
`;

export const CompanyNoticeModalStyleWrapper = styled(BasicModal)`
  &.company-notice-modal {
    .ant-modal-body {
      max-height: 600px;
    }
  }
`;

export const CompanyNoticeIconStyleWrapper = styled(NotificationFilled)`
  color: ${({ theme }) =>
    theme.sharedTheme.basic.colorFontGrayByWhite} !important;
  width: 16px;
  height: 16px;
`;

export const QuickActionsStyleWrapper = styled('div')`
  width: 100%;
  margin-bottom: 8px;

  .action-space-wrapper {
    width: 100%;

    & > .ant-space-item {
      flex: 1;

      .basic-tooltips-wrapper {
        width: 100%;

        & .ant-space-item {
          width: 100%;
        }
      }

      .action-item {
        position: relative;
        width: 100%;
        padding: 6px 0;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid
          ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
        color: ${({ theme }) => theme.sharedTheme.basic.colorFontGrayByWhite};

        &:hover {
          background-color: ${({ theme }) =>
            theme.sharedTheme.uiToken.colorFillTertiary} !important;
        }
      }

      .action-item-active {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
        background-color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorFillTertiary};
      }

      .action-item-dot {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
      }
    }
  }
`;

export const ProjectTitleStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
