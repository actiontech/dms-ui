import { styled } from '@mui/material/styles';

export const RewriteProgressContainerStyleWrapper = styled('div')`
  padding: 20px;
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  margin-bottom: 24px;
  box-shadow: 0 2px 8px
    ${({ theme }) => theme.sharedTheme.basic.colorShadowByWhite};
  transition: all 0.3s ease;

  .progress-toggle-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
  }

  &.completed {
    padding: 12px 20px;
    margin-bottom: 12px;
  }
`;

export const ProgressHeaderStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .progress-title {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
  }

  .progress-status {
    display: flex;
    align-items: center;
    font-size: 14px;

    .status-text {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      font-weight: 500;

      &.completed {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
      }

      &.error {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
      }
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }
  }
`;

export const OverallProgressStyleWrapper = styled('div')`
  margin-bottom: 20px;

  .overall-progress-bar {
    width: 100%;
    height: 8px;
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillSecondary};
    border-radius: 4px;
    overflow: hidden;
    margin: 16px 0;

    .progress-fill {
      height: 100%;
      background: linear-gradient(
        90deg,
        ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary},
        ${({ theme }) => theme.sharedTheme.basic.colorPrimaryActive}
      );
      border-radius: 4px;
      transition: width 1s ease;
      min-width: 0%;
    }
  }

  .progress-text {
    text-align: center;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    font-size: 14px;
    margin-top: 8px;
    font-weight: 500;
  }
`;

export const RulesListStyleWrapper = styled('div')`
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: 12px;
  }
`;

export const RuleItemStyleWrapper = styled('div')`
  padding: 16px;
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  transition: all 0.3s ease;

  &.rule-item-processing {
    border-color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    box-shadow: 0 0 0 2px
      ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary}20;
    transform: scale(1.01);
  }

  &.rule-item-completed {
    border-color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccessBgHover};
  }

  &.rule-item-error {
    border-color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorErrorBgHover};
  }
`;

export const RuleHeaderStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  .rule-name {
    font-weight: 500;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 15px;
    flex: 1;
    margin-right: 16px;
  }

  .rule-status {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    flex-shrink: 0;
    min-width: 200px;

    > * + * {
      margin-left: 12px;
    }
  }
`;

export const RuleDescriptionStyleWrapper = styled('div')`
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 12px;
`;

export const StatusTextStyleWrapper = styled('span')`
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  min-width: 120px;
  text-align: left;
  transition: color 0.3s ease;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};

  &.completed {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
  }

  &.error {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
  }

  &.processing {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
  }
`;

export const ErrorMessageStyleWrapper = styled('div')`
  margin-top: 8px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorErrorBgHover};
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  border-radius: 4px;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
  font-size: 12px;
  line-height: 1.4;
`;

export const RewriteFailedStyleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding: 12px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  color: #ff4d4f;

  .rewrite-failed-title {
    font-weight: bold;
  }

  .rewrite-failed-message {
    margin: 8px 0;
  }
`;

export const RewrittenSqlDisplayStyleWrapper = styled('div')`
  margin-top: 12px;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

  .rewritten-sql-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .sql-label {
      font-size: 13px;
      font-weight: 500;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      display: flex;
      align-items: center;

      &::before {
        content: '';
        width: 8px;
        height: 8px;
        margin-right: 6px;
        border-radius: 50%;
        background: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
      }
    }
  }

  .sql-actions {
    display: flex;

    > * + * {
      margin-left: 8px;
    }

    .copy-btn {
      background: none;
      border: none;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      cursor: pointer;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
      transition: all 0.2s ease;

      &:hover {
        background: ${({ theme }) =>
          theme.sharedTheme.basic.colorPrimaryBgHover};
      }
    }
  }
`;

// 折叠状态的紧凑样式
export const CompactProgressStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;

  .compact-left {
    display: flex;
    align-items: center;
    flex: 1;

    .compact-title {
      font-size: 14px;
      font-weight: 500;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      margin-right: 12px;
    }

    .compact-progress-bar {
      flex: 1;
      height: 4px;
      background: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillSecondary};
      border-radius: 2px;
      overflow: hidden;
      margin-right: 16px;

      .progress-fill {
        height: 100%;
        background: linear-gradient(
          90deg,
          ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess},
          ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess}
        );
        border-radius: 2px;
        transition: width 0.3s ease;
      }
    }
  }

  .compact-right {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
    font-weight: 500;
  }
`;

// 规则项动画样式
export const RuleItemAnimationStyleWrapper = styled('div')`
  .rule-item-move {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .rule-item-completed {
    animation: rule-complete 0.6s ease-out;
  }

  @keyframes rule-complete {
    0% {
      transform: scale(1);
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
    }

    50% {
      transform: scale(1.02);
      background: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorSuccessBgHover};
    }

    100% {
      transform: scale(1);
      background: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorSuccessBgHover};
    }
  }
`;

// 新的波浪进度组件样式
export const WaveProgressStyleWrapper = styled('div')`
  position: relative;
  width: 60px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 16px;
  overflow: hidden;
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillSecondary};
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

  .wave-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
  }

  .wave-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillTertiary};
    border-radius: 16px;
  }

  .wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 60%;
    border-radius: 50% 50% 0 0;
    opacity: 0.6;
    animation: wave-animation 3s ease-in-out infinite;
  }

  .wave1 {
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    animation-delay: 0s;
  }

  .wave2 {
    background: ${({ theme }) => theme.sharedTheme.basic.colorPrimaryActive};
    animation-delay: 1s;
    height: 50%;
    opacity: 0.4;
  }

  .wave3 {
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    animation-delay: 2s;
    height: 40%;
    opacity: 0.3;
  }

  @keyframes wave-animation {
    0% {
      transform: translateX(-50%) translateY(0);
    }

    50% {
      transform: translateX(-50%) translateY(-8px);
    }

    100% {
      transform: translateX(-50%) translateY(0);
    }
  }

  .stage-indicator {
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;

    .stage-dots {
      display: flex;
      gap: 3px;

      .stage-dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorTextQuaternary};
        transition: all 0.3s ease;

        &.active {
          background: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
          transform: scale(1.3);
          box-shadow: 0 0 4px
            ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary}50;
        }

        &.completed {
          background: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
        }
      }
    }
  }

  @keyframes icon-bounce {
    0% {
      transform: translate(-50%, -50%) scale(1);
    }

    50% {
      transform: translate(-50%, -50%) scale(1.1);
    }

    100% {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  &.completed {
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccessBgHover};
    border-color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};

    .wave {
      display: none;
    }

    .wave-background {
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
      opacity: 0.2;
    }

    .progress-icon {
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
      border-color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
      color: white;
    }
  }

  &.error {
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorErrorBgHover};
    border-color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};

    .wave {
      display: none;
    }

    .wave-background {
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
      opacity: 0.2;
    }

    .progress-icon {
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
      border-color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
      color: white;
    }
  }

  &.waiting {
    .wave {
      display: none;
    }

    .progress-icon {
      opacity: 0.5;
    }
  }

  &.processing {
    .wave {
      animation-play-state: running;
    }
  }
`;
