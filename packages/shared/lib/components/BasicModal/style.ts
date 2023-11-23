import { styled } from '@mui/material/styles';
import { Modal } from 'antd';

export const BasicModalStyleWrapper = styled(Modal)`
  &.basic-modal-wrapper.ant-modal {
    .ant-modal-content {
      padding: 0;
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicModal.content.backgroundColor};
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicModal.content.border};

      .ant-modal-close {
        top: 22px;
      }

      .ant-modal-header {
        display: flex;
        align-items: center;
        border-radius: 8px 8px 0 0;
        padding: 20px 24px;
        margin-bottom: 0;
        border-bottom: ${({ theme }) =>
          theme.sharedTheme.components.basicModal.content.header.border};

        .ant-modal-title {
          color: ${({ theme }) =>
            theme.sharedTheme.components.basicModal.content.header.title.color};
          font-size: 20px;
          font-style: normal;
          font-weight: 600;
          line-height: 28px;
        }
      }

      .ant-modal-body {
        padding: 24px;
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicModal.content.body.color};
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 22px;

        .ant-form {
          .ant-form-item {
            .ant-form-item-row {
              .ant-form-item-label {
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: 22px;
              }

              .ant-form-item-required {
                &::before {
                  display: none !important;
                }

                &::after {
                  display: inline-block;
                  margin-inline-end: 4px;
                  color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
                  font-size: 14px;
                  line-height: 1;
                  content: '*' !important;
                  visibility: visible !important;
                  margin-inline-start: 4px !important;
                }
              }
            }
          }
        }
      }

      .ant-modal-footer {
        margin-top: 0;
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        background: ${({ theme }) =>
          theme.sharedTheme.components.basicModal.content.footer
            .backgroundColor};
        border-radius: 0 0 8px 8px;

        .ant-btn + .ant-btn:not(.ant-dropdown-trigger) {
          margin-left: 12px;
        }
      }
    }
  }
`;
