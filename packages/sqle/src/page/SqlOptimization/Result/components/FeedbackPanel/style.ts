import { styled } from '@mui/material/styles';

export const FeedbackEntryStyleWrapper = styled('div')`
  .vote-buttons {
    display: flex;
    margin-bottom: 12px;
  }

  .vote-tile-btn {
    flex: 1;
    height: 76px;
    border-radius: 8px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    border-left-width: 1px;
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
    cursor: pointer;
    transition: border-color 0.18s ease, background-color 0.18s ease,
      color 0.18s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    padding: 0;

    &:first-of-type {
      margin-right: 10px;
    }

    .vote-btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 5px;
      transition: transform 0.15s ease;
    }

    .vote-btn-text {
      font-size: 13px;
      font-weight: 600;
      line-height: 1;
    }

    &:hover {
      border-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorBorderSecondary};
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};

      .vote-btn-icon {
        transform: scale(1.15);
      }
    }

    &.agree-active {
      border-color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};

      &:hover {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
      }
    }

    &.disagree-active {
      border-color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};

      &:hover {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
      }
    }
  }

  .reason-area {
    animation: feedback-slide-down 0.2s ease;
    margin-top: 8px;
  }

  @keyframes feedback-slide-down {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .submitted-view {
    position: relative;
    padding: 12px 14px;
    border-radius: 8px;
    border-left: 3px solid transparent;
    overflow: hidden;
    transition: border-color 0.2s ease;

    &.agree {
      border-left-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorSuccess};
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
    }

    &.disagree {
      border-left-color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
    }

    .submitted-header {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
    }

    .vote-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      margin-right: 6px;
    }

    &.agree .vote-icon {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
    }

    &.disagree .vote-icon {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
    }

    .vote-label {
      font-size: 14px;
      font-weight: 700;
      flex: 1;

      &.agree {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
      }

      &.disagree {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
      }
    }

    .re-edit-btn {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 6px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      transition: all 0.15s ease;
      padding: 0;

      &:hover {
        background-color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorFillSecondary};
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      }
    }

    .submitted-reason {
      font-size: 13px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      line-height: 1.6;
      word-break: break-all;
      margin-bottom: 8px;
    }

    .submitted-time {
      display: flex;
      align-items: center;
      font-size: 11px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};

      .time-icon {
        margin-right: 4px;
        display: flex;
        align-items: center;
      }
    }
  }
`;

export const FeedbackListStyleWrapper = styled('div')`
  .feedback-card {
    display: flex;
    align-items: flex-start;
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    .feedback-avatar {
      flex-shrink: 0;
      margin-right: 10px;
    }
  }

  .feedback-card-body {
    flex: 1;
    min-width: 0;
    margin-right: 8px;
  }

  .feedback-card-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }

  .creator-name {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    margin-right: 8px;
  }

  .vote-badge {
    padding: 1px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
    margin-right: 8px;

    &.agree {
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
    }

    &.disagree {
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
    }
  }

  .feedback-time {
    font-size: 11px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  }

  .feedback-reason {
    font-size: 12px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    margin-top: 2px;
    word-break: break-all;
    line-height: 1.5;
  }

  .no-records {
    text-align: center;
    padding: 16px 0;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-size: 13px;
  }
`;

export const FeedbackPanelStyleWrapper = styled('div')`
  .feedback-section-title {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    margin-bottom: 12px;
  }

  .feedback-divider {
    margin: 16px 0;
  }

  .review-records-title {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    margin-bottom: 10px;
  }
`;
