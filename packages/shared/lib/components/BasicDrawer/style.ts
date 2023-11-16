import { styled } from '@mui/material/styles';
import { Drawer } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const BasicDrawerStyleWrapper = styled(Drawer)`
  &.basic-drawer-wrapper.${ANTD_PREFIX_STR}-drawer-content {
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicDrawer.color} !important;
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.basicDrawer.backgroundColor} !important;
    box-shadow: ${({ theme }) =>
      theme.sharedTheme.components.basicDrawer.boxShadow};

    .${ANTD_PREFIX_STR}-drawer-wrapper-body {
      .${ANTD_PREFIX_STR}-drawer-header {
        padding: 18px 24px 17px;
      }
      .${ANTD_PREFIX_STR}-drawer-body {
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
    }

    .closed-icon-custom {
      position: absolute;
      z-index: 99;
      top: 48px;
      left: -12px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorTextQuaternary};
      box-shadow: 0 1px 4px 0 rgba(51, 44, 31, 0.12);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;

      svg {
        color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
        font-weight: 900;
      }
    }
  }

  &.drawer-wrapper-no-padding .${ANTD_PREFIX_STR}-drawer-body {
    padding: 0 !important;
  }
`;
