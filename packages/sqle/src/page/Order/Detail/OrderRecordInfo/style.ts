import { styled } from '@mui/material/styles';
import { Steps } from 'antd';

export const OrderStepsStyleWrapper = styled('div')`
  width: 360px;
  min-width: 360px;
  overflow-y: auto;
  padding: 0 24px 65px;
  transition: width 1s ease-in-out;
  border-left: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillQuaternary};

  .order-record-info-header {
    display: flex;
    height: 60px;
    padding: 24px 0;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    align-self: stretch;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

    &-text {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
    }

    .custom-icon-close {
      cursor: pointer;
    }
  }

  .order-steps-basic-info {
    padding: 24px 0;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

    &-title {
      margin-bottom: 16px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
    }

    &-item {
      display: flex;
      padding: 8px 0;
      align-items: center;

      &-label {
        width: 80px;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
        font-size: 13px;
        font-weight: 400;
        line-height: 20px;
      }

      &-value {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
        font-size: 13px;
        font-weight: 500;
        line-height: 20px;

        .action-avatar {
          .ant-avatar-string {
            font-size: 8px !important;
          }
        }
      }
    }
  }

  .custom-steps-wrapper {
    padding: 24px 0;

    &-title {
      margin-bottom: 16px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      font-size: 13px;
      font-weight: 500;
      line-height: 20px;
    }
  }
`;

export const OrderStepsItemStyleWrapper = styled('div')`
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
  box-shadow: ${({ theme }) => theme.sqleTheme.order.orderSteps.boxShadow};
  width: 100%;

  .step-title {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    /* color: red; */
  }

  .step-info {
    width: 100%;
    margin-top: 4px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    font-size: 12px;
    font-weight: 500;
    line-height: 19px;

    .ant-divider {
      margin: 0 !important;
    }

    &-tips {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
      font-size: 12px;
      font-weight: 500;
      line-height: 19px;
      margin-top: 4px;
    }

    &-rejected {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
      font-size: 13px;
      font-weight: 400;
      line-height: 20px;
      width: 100%;
    }
  }
`;

export const CustomSteps = styled(Steps)`
  &.ant-steps {
    .ant-steps-item:not(:last-of-type) {
      margin-bottom: 42px;
    }

    .ant-steps-item {
      &-container {
        .ant-steps-item-icon {
          margin-top: 20px;
          color: ${({ theme }) =>
            theme.sharedTheme.uiToken.colorTextQuaternary} !important;
        }

        .ant-steps-item-tail {
          margin-top: 20px;
          width: 1.5px !important;
          height: 71px !important;

          &::after {
            width: 1.5px !important;
            height: 71px !important;
            color: ${({ theme }) =>
              theme.sharedTheme.uiToken.colorBorderSecondary} !important;
          }
        }

        .ant-steps-item-content {
          width: 260px;
          margin-right: 0 !important;

          .ant-steps-item-title {
            padding-right: 0 !important;
            width: 100%;
          }
        }
      }
    }

    .ant-steps-item-active {
      .ant-steps-icon {
        color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorTextQuaternary} !important;
      }
    }

    .ant-steps-item-finish {
      .ant-steps-icon {
        color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorSuccess} !important;
      }

      .ant-steps-item-tail {
        &::after {
          background-color: ${({ theme }) =>
            theme.sharedTheme.uiToken.colorSuccess} !important;
        }
      }
    }

    .ant-steps-item-finish.prev-rejected-step {
      .ant-steps-item-tail {
        &::after {
          background-color: ${({ theme }) =>
            theme.sharedTheme.uiToken.colorWarning} !important;
        }
      }
    }
  }
`;

export const OrderHistoryStepsStyleWrapper = styled('div')`
  display: flex;
  padding: 24px 0;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  flex-direction: column;

  .history-steps-trigger-wrapper {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
  }
`;
