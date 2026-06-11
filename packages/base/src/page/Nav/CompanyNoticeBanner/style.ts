import { styled, keyframes } from '@mui/material/styles';

const MARQUEE_GAP = 32;

const noticeMarquee = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50% - ${MARQUEE_GAP}px / 2));
  }
`;

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
    position: relative;
    flex: 1;
    min-width: 0;
    margin-left: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    cursor: pointer;
  }

  .notice-measure {
    position: absolute;
    visibility: hidden;
    white-space: nowrap;
    pointer-events: none;
    font-size: 13px;
    line-height: 1.5;
  }

  .notice-text {
    flex: 1;
    min-width: 0;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
    font-size: 13px;
    line-height: 1.5;
    overflow: hidden;
    white-space: nowrap;

    &.is-ellipsis {
      text-overflow: ellipsis;
    }
  }

  .notice-marquee-track {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    gap: ${MARQUEE_GAP}px;
    flex-shrink: 0;
    will-change: transform;
  }

  .notice-marquee-animate {
    animation: ${noticeMarquee} var(--marquee-duration, 10s) linear infinite;
  }

  .notice-content-area:hover .notice-marquee-animate {
    animation-play-state: paused;
  }

  .notice-marquee-text {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
    font-size: 13px;
    line-height: 1.5;
    white-space: nowrap;
    flex-shrink: 0;
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

  @media (prefers-reduced-motion: reduce) {
    .notice-marquee-animate {
      animation: none;
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
