import { styled } from '@mui/material/styles';
import { Modal } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const BasicModalStyleWrapper = styled(Modal)`
  &.basic-modal-wrapper.${ANTD_PREFIX_STR}-modal {
    .${ANTD_PREFIX_STR}-modal-content {
      padding: 0;
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicModal.content.backgroundColor};
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicModal.content.border};

      .${ANTD_PREFIX_STR}-modal-close {
        top: 22px;
      }
      .${ANTD_PREFIX_STR}-modal-header {
        display: flex;
        align-items: center;
        border-radius: 8px 8px 0 0;
        padding: 20px 24px;
        margin-bottom: 0;
        border-bottom: ${({ theme }) =>
          theme.sharedTheme.components.basicModal.content.header.border};

        .${ANTD_PREFIX_STR}-modal-title {
          color: ${({ theme }) =>
            theme.sharedTheme.components.basicModal.content.header.title.color};
          font-size: 20px;
          font-style: normal;
          font-weight: 600;
          line-height: 28px;
        }
      }

      .${ANTD_PREFIX_STR}-modal-body {
        padding: 24px;
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicModal.content.body.color};
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 22px;

        .${ANTD_PREFIX_STR}-form {
          .${ANTD_PREFIX_STR}-form-item {
            .${ANTD_PREFIX_STR}-form-item-row {
              .${ANTD_PREFIX_STR}-form-item-label {
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: 22px;
              }

              .${ANTD_PREFIX_STR}-form-item-required {
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

      .${ANTD_PREFIX_STR}-modal-footer {
        margin-top: 0;
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        background: ${({ theme }) =>
          theme.sharedTheme.components.basicModal.content.footer
            .backgroundColor};
        border-radius: 0 0 8px 8px;

        .${ANTD_PREFIX_STR}-btn
          + .${ANTD_PREFIX_STR}-btn:not(.${ANTD_PREFIX_STR}-dropdown-trigger) {
          margin-left: 12px;
        }
      }
    }
  }
`;
