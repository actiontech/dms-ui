import { styled } from '@mui/material/styles';

export const AccountContentStyleWrapper = styled('div')`
  width: 640px;
  margin: 0 auto;
`;

export const AccountContentTitleStyleWrapper = styled('div')`
  padding: 60px 0 32px;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
  font-size: 24px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
`;

export const PrivacyControlsStyleWrapper = styled('div')`
  margin: 20px 0;

  .privacy-control-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .privacy-icon {
      width: 30px;
      height: 30px;
      background: ${({ theme }) => theme.sharedTheme.basic.colorPrimaryBgHover};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .privacy-title {
      font-size: 16px;
      font-weight: 500;
      margin-left: 4px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
    }
  }

  .privacy-description {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 16px;
  }

  .privacy-control-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillTertiary};
    border-radius: 8px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    transition: all 0.2s ease;
  }

  .privacy-status-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .privacy-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.authorized {
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
    }

    &.unauthorized {
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorWarning};
    }
  }

  .privacy-status-text {
    font-size: 14px;
    font-weight: 500;

    &.authorized {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
    }

    &.unauthorized {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorWarning};
    }
  }

  .privacy-control-action {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
`;
