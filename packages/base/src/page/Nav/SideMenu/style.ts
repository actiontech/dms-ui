import { styled } from '@mui/material/styles';
import { Typography } from 'antd';
import { BasicModal } from '@actiontech/shared';
import { NotificationFilled } from '@ant-design/icons';

export const VersionModalDescribeTextStyleWrapper = styled(Typography.Text)`
  white-space: pre-line;
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
