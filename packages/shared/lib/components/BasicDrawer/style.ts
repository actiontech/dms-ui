import { styled } from '@mui/material/styles';
import { Drawer } from 'antd';

export const BasicDrawerStyleWrapper = styled(Drawer)`
  &.basic-drawer-wrapper.ant-drawer-content {
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicDrawer.color} !important;
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.basicDrawer.backgroundColor} !important;
    box-shadow: ${({ theme }) =>
      theme.sharedTheme.components.basicDrawer.boxShadow};

    .ant-drawer-wrapper-body {
      .ant-drawer-header {
        padding: 18px 24px 17px;
      }
      .ant-drawer-body {
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
    }

    .closed-icon-custom {
      position: absolute;
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

  &.drawer-wrapper-no-padding .ant-drawer-body {
    padding: 0 !important;
  }
`;
