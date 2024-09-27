import { styled } from '@mui/material/styles';

export const SideMenuStyleWrapper = styled('div')`
  &.dms-layout-side {
    position: sticky;
    top: 0;
    width: ${({ theme }) => theme.sharedTheme.nav.width}px;
    max-height: 100vh;
    overflow: hidden;
    display: flex;
    padding: 0 ${({ theme }) => theme.sharedTheme.nav.padding}px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.sharedTheme.nav.backgroundColor};
    box-shadow: ${({ theme }) => theme.sharedTheme.nav.boxShadow};
    border-right: ${({ theme }) => theme.sharedTheme.nav.border};

    &::-webkit-scrollbar {
      width: 4px;
    }

    &:hover {
      overflow-y: auto;
    }

    .dms-layout-side-start {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .title {
        display: flex;
        height: 60px;
        padding: 8px;
        align-items: center;
        flex-shrink: 0;
        align-self: stretch;
        cursor: pointer;

        .label {
          text-align: center;
          font-feature-settings: 'case' on;
          font-size: 18px;
          font-style: normal;
          font-weight: 700;
          line-height: 26px;
        }

        .label-primary {
          color: ${({ theme }) => theme.sharedTheme.nav.title.color[0]};
          margin-right: 10px;
        }

        .label-base {
          color: ${({ theme }) => theme.sharedTheme.nav.title.color[1]};
        }
      }

      .custom-project-selector {
        width: calc(
          ${({ theme }) => theme.sharedTheme.nav.width}px -
            ${({ theme }) => theme.sharedTheme.nav.padding * 2}px
        );
      }

      .custom-menu.ant-menu.ant-menu-inline {
        width: calc(
          ${({ theme }) => theme.sharedTheme.nav.width}px -
            ${({ theme }) => theme.sharedTheme.nav.padding * 2}px
        );
        border-inline-end: 0;

        .ant-menu-item {
          display: flex;
          align-items: center;
          padding: 0 8px;
          height: 36px;
          border-radius: 4px;
          padding-left: 8px !important;

          &:hover {
            background-color: ${({ theme }) =>
              theme.sharedTheme.nav.menu.hoverBackgroundColor};

            .ant-menu-title-content {
              font-weight: 500;
              color: ${({ theme }) =>
                theme.sharedTheme.nav.menu.hoverLabelColor};
            }
          }

          .ant-menu-title-content {
            color: ${({ theme }) => theme.sharedTheme.nav.menu.labelColor};
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            margin-inline-start: 12px;
          }
        }

        .ant-menu-item.menu-todo-list-item {
          .ant-menu-title-content {
            display: inline-flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
          }
        }

        .ant-menu-submenu {
          padding: 0;

          .ant-menu-submenu-title {
            display: flex;
            align-items: center;
            height: 36px;
            border-radius: 4px;
            padding: 0 8px;
            padding-left: 8px !important;
            color: ${({ theme }) =>
              theme.sharedTheme.uiToken.colorTextQuaternary};

            &:hover {
              background-color: ${({ theme }) =>
                theme.sharedTheme.nav.menu.hoverBackgroundColor};
              color: ${({ theme }) =>
                theme.sharedTheme.nav.menu.hoverLabelColor};

              .ant-menu-title-content {
                font-weight: 500;
                color: ${({ theme }) =>
                  theme.sharedTheme.nav.menu.hoverLabelColor};
              }
            }
          }

          .ant-menu-title-content {
            color: ${({ theme }) => theme.sharedTheme.nav.menu.labelColor};
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            margin-inline-start: 12px;
          }

          .ant-menu.ant-menu-sub.ant-menu-inline {
            .ant-menu-item {
              padding: 0 8px 0 26px !important;
            }
          }
        }

        .ant-menu-submenu-selected {
          .ant-menu-submenu-title {
            .ant-menu-item-icon,
            > svg {
              filter: brightness(0.3);
            }

            .ant-menu-title-content,
            > svg {
              font-weight: 500;
              color: ${({ theme }) =>
                theme.sharedTheme.nav.menu.hoverLabelColor};
            }
          }
        }

        .ant-menu-item-selected {
          background-color: ${({ theme }) =>
            theme.sharedTheme.nav.menu.hoverBackgroundColor};

          .ant-menu-item-icon {
            filter: brightness(0.3);
          }

          .ant-menu-title-content {
            font-weight: 500;
            color: ${({ theme }) => theme.sharedTheme.nav.menu.hoverLabelColor};
          }
        }

        .ant-menu-item-divider {
          color: ${({ theme }) => theme.sharedTheme.nav.menu.dividerColor};
        }

        .ant-menu-item-group {
          .ant-menu-item-group-title {
            padding: 8px 8px 0;
            color: ${({ theme }) => theme.sharedTheme.nav.menu.groupLabelColor};
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: 19px;
          }
        }
      }
    }

    .dms-layout-side-end {
      position: sticky;
      bottom: 0;
      background-color: ${({ theme }) => theme.sharedTheme.nav.backgroundColor};
      z-index: 10;
      display: flex;
      padding: 20px 8px;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;

      .action-avatar {
        cursor: pointer;
      }

      .global-system-icon-wrapper {
        cursor: pointer;
        display: flex;
        width: 32px;
        height: 32px;
        padding: 0;
        justify-content: center;
        align-items: center;
        border-radius: 100px;
        background-color: ${({ theme }) =>
          theme.sharedTheme.nav.globalSystem.backgroundColor};
      }
    }
  }
`;

export const PopoverInnerStyleWrapper = styled('div')`
  width: calc(
    ${({ theme }) => theme.sharedTheme.nav.width}px -
      ${({ theme }) => theme.sharedTheme.nav.padding * 2}px
  );
  border-radius: 8px;
  border: ${({ theme }) => theme.sharedTheme.nav.userNavigate.border};
  box-shadow: ${({ theme }) => theme.sharedTheme.nav.userNavigate.boxShadow};
  background-color: ${({ theme }) =>
    theme.sharedTheme.nav.userNavigate.backgroundColor};

  .header {
    padding: 12px 14px;
    align-items: center;
    border-bottom: ${({ theme }) =>
      theme.sharedTheme.nav.userNavigate.title.border};
    color: ${({ theme }) => theme.sharedTheme.nav.userNavigate.title.color};
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }

  .content {
    padding: 8px 10px;

    &-item {
      padding: 0 6px;
      cursor: pointer;
      display: flex;
      height: 32px;
      align-items: center;
      align-self: stretch;
      border-radius: 4px;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      color: ${({ theme }) => theme.sharedTheme.nav.userNavigate.content.color};

      &:hover {
        background-color: ${({ theme }) =>
          theme.sharedTheme.nav.userNavigate.content.hoverBackgroundColor};
      }

      &-text {
        margin-left: 8px;
        width: 100%;
      }
    }

    &-item-disabled {
      opacity: 0.5;
      color: ${({ theme }) =>
        theme.sharedTheme.nav.userNavigate.content.disabledColor};

      &:hover {
        background-color: transparent;
      }

      .content-item-text {
        color: inherit;
      }

      svg {
        opacity: 0.5;
      }
    }
  }

  .footer {
    padding: 12px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-text {
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
      color: ${({ theme }) =>
        theme.sharedTheme.nav.userNavigate.footer.text.color};
    }

    &-icon {
      display: flex;
      padding: 3px;
      justify-content: center;
      align-items: flex-start;
      border-radius: 100px;
      border: ${({ theme }) =>
        theme.sharedTheme.nav.userNavigate.footer.iconWrapper.border};
      background-color: ${({ theme }) =>
        theme.sharedTheme.nav.userNavigate.footer.iconWrapper.backgroundColor};

      &-wrapper:first-of-type {
        margin-right: 4px;
      }

      &-wrapper {
        display: flex;
        width: 26px;
        height: 26px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: ${({ theme }) =>
          theme.sharedTheme.nav.userNavigate.footer.iconWrapper.color};
        border-radius: 100px;
        transition: background-color 0.3s ease;
      }

      &-active {
        background-color: ${({ theme }) =>
          theme.sharedTheme.nav.userNavigate.footer.iconWrapper
            .activeBackgroundColor};
        color: ${({ theme }) =>
          theme.sharedTheme.nav.userNavigate.footer.iconWrapper.activeColor};
      }
    }
  }
`;

export const LayoutStyleWrapper = styled('section')`
  display: flex;
  min-height: 100vh;
  width: 100%;

  .dms-layout-side {
    flex: 0 0 ${({ theme }) => theme.sharedTheme.nav.width}px;
  }

  .dms-layout-content {
    flex: 1 1 calc(100% - ${({ theme }) => theme.sharedTheme.nav.width}px);
    min-width: 1060px;
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .copyright-information {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      font-size: 13px;
      text-align: center;
      z-index: 1000;
      padding: 20px 0;
      background-color: transparent;
      width: 350px;
      margin: auto auto 0;
    }
  }
`;
