import { styled } from '@mui/material/styles';

export const CompanyNoticeBannerStyleWrapper = styled('div')`
  position: fixed;
  top: 0;
  left: ${({ theme }) => theme.sharedTheme.nav.width}px;
  width: calc(100% - ${({ theme }) => theme.sharedTheme.nav.width}px);
  display: flex;
  align-items: center;
  height: 36px;
  flex-shrink: 0;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.sharedTheme.uiToken.colorWarningBgHover}e6 0%,
    ${({ theme }) => theme.sharedTheme.uiToken.colorWarningBgHover}bf 100%
  );
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorWarning}66;
  padding: 0 16px;
  z-index: 100;

  .notice-label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorWarning};
    font-weight: 600;
    font-size: 13px;
    white-space: nowrap;
    flex-shrink: 0;
    padding-right: 12px;
    border-right: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorWarning}55;

    .notice-label-icon {
      font-size: 14px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorWarning};
    }
  }

  .notice-content-area {
    flex: 1;
    min-width: 0;
    margin-left: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .notice-text {
    flex: 1;
    min-width: 0;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
    font-size: 13px;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .notice-expand-btn {
    flex-shrink: 0;
    padding: 0 4px;
    font-size: 12px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    cursor: pointer;
    user-select: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const CompanyNoticeDetailContentStyleWrapper = styled('div')`
  max-height: 400px;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
`;
