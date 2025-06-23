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

    > * + * {
      margin-left: 8px;
    }

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

export const CircularProgressStyleWrapper = styled('div')`
  position: relative;
  width: 32px;
  height: 32px;
  flex-shrink: 0;

  .circular-progress {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    position: relative;
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillSecondary};

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: conic-gradient(
        ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary}
          var(--progress, 0deg),
        transparent var(--progress, 0deg)
      );
      transition: background 0.3s ease;
    }

    &::after {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
    }

    &.completed {
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};

      &::before {
        background: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
      }
    }

    &.error {
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorError};

      &::before {
        background: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
      }
    }
  }

  .progress-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 14px !important;
      height: 14px !important;
      margin: 0;
      vertical-align: middle;
    }

    &.spinning {
      animation: icon-spin 1s linear infinite;
    }

    @keyframes icon-spin {
      0% {
        transform: translate(-50%, -50%) rotate(0deg);
      }

      100% {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }
  }
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

      > * + * {
        margin-left: 6px;
      }

      &::before {
        content: '';
        width: 8px;
        height: 8px;
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
