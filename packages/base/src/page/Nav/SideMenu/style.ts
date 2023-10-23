import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';
import { Typography } from 'antd5';
import { BasicModal } from '@actiontech/shared';

export const SideMenuStyleWrapper = styled('div')`
  &.dms-layout-side {
    position: sticky;
    top: 0;
    width: ${({ theme }) => theme.baseTheme.sideMenu.width}px;
    max-height: 100vh;
    overflow: hidden;
    display: flex;
    padding: 0 ${({ theme }) => theme.baseTheme.sideMenu.padding}px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    background-color: ${({ theme }) =>
      theme.baseTheme.sideMenu.backgroundColor};
    box-shadow: ${({ theme }) => theme.baseTheme.sideMenu.boxShadow};
    border-right: ${({ theme }) => theme.baseTheme.sideMenu.border};

    &:hover {
      overflow-y: auto;
    }

    .dms-layout-side-start {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;

      .title {
        display: flex;
        height: 60px;
        padding: 8px;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        align-self: stretch;
        cursor: pointer;

        .label {
          text-align: center;
          font-feature-settings: 'case' on;
          font-family: 'Plus Jakarta Sans';
          font-size: 18px;
          font-style: normal;
          font-weight: 700;
          line-height: 26px;
        }

        .label-primary {
          color: ${({ theme }) => theme.baseTheme.sideMenu.title.color[0]};
        }

        .label-base {
          color: ${({ theme }) => theme.baseTheme.sideMenu.title.color[1]};
        }
      }

      .custom-project-selector {
        width: calc(
          ${({ theme }) => theme.baseTheme.sideMenu.width}px -
            ${({ theme }) => theme.baseTheme.sideMenu.padding * 2}px
        );
      }

      .custom-menu.${ANTD_PREFIX_STR}-menu.${ANTD_PREFIX_STR}-menu-inline {
        width: calc(
          ${({ theme }) => theme.baseTheme.sideMenu.width}px -
            ${({ theme }) => theme.baseTheme.sideMenu.padding * 2}px
        );
        border-inline-end: 0;

        .${ANTD_PREFIX_STR}-menu-item {
          display: flex;
          align-items: center;
          padding: 0 8px;
          height: 36px;
          border-radius: 4px;
          padding-left: 8px !important;

          &:hover {
            background-color: ${({ theme }) =>
              theme.baseTheme.sideMenu.menu.hoverBackgroundColor};

            .${ANTD_PREFIX_STR}-menu-title-content {
              font-weight: 500;
              color: ${({ theme }) =>
                theme.baseTheme.sideMenu.menu.hoverLabelColor};
            }
          }

          .${ANTD_PREFIX_STR}-menu-title-content {
            color: ${({ theme }) => theme.baseTheme.sideMenu.menu.labelColor};
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            margin-inline-start: 12px;
          }
        }

        .${ANTD_PREFIX_STR}-menu-item.menu-todo-list-item {
          .${ANTD_PREFIX_STR}-menu-title-content {
            display: inline-flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
          }
        }

        .${ANTD_PREFIX_STR}-menu-submenu {
          padding: 0;

          .${ANTD_PREFIX_STR}-menu-submenu-title {
            display: flex;
            align-items: center;
            height: 36px;
            border-radius: 4px;
            padding: 0 8px;
            padding-left: 8px !important;

            &:hover {
              background-color: ${({ theme }) =>
                theme.baseTheme.sideMenu.menu.hoverBackgroundColor};

              .${ANTD_PREFIX_STR}-menu-title-content {
                font-weight: 500;
                color: ${({ theme }) =>
                  theme.baseTheme.sideMenu.menu.hoverLabelColor};
              }
            }
          }

          .${ANTD_PREFIX_STR}-menu-title-content {
            color: ${({ theme }) => theme.baseTheme.sideMenu.menu.labelColor};
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            margin-inline-start: 12px;
          }

          .${ANTD_PREFIX_STR}-menu.${ANTD_PREFIX_STR}-menu-sub.${ANTD_PREFIX_STR}-menu-inline {
            .${ANTD_PREFIX_STR}-menu-item {
              padding: 0 8px 0 26px !important;
            }
          }
        }

        .${ANTD_PREFIX_STR}-menu-item-selected {
          background-color: ${({ theme }) =>
            theme.baseTheme.sideMenu.menu.hoverBackgroundColor};

          .${ANTD_PREFIX_STR}-menu-title-content {
            font-weight: 500;
            color: ${({ theme }) =>
              theme.baseTheme.sideMenu.menu.hoverLabelColor};
          }
        }

        .${ANTD_PREFIX_STR}-menu-item-divider {
          color: ${({ theme }) => theme.baseTheme.sideMenu.menu.dividerColor};
        }

        .${ANTD_PREFIX_STR}-menu-item-group {
          .${ANTD_PREFIX_STR}-menu-item-group-title {
            padding: 8px 8px 0;
            color: ${({ theme }) =>
              theme.baseTheme.sideMenu.menu.groupLabelColor};
            font-family: 'Plus Jakarta Sans';
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
      background-color: ${({ theme }) =>
        theme.baseTheme.sideMenu.backgroundColor};
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
          theme.baseTheme.sideMenu.globalSystem.backgroundColor};
      }
    }
  }
`;

export const PopoverInnerStyleWrapper = styled('div')`
  width: calc(
    ${({ theme }) => theme.baseTheme.sideMenu.width}px -
      ${({ theme }) => theme.baseTheme.sideMenu.padding * 2}px
  );
  border-radius: 8px;
  border: ${({ theme }) => theme.baseTheme.sideMenu.userNavigate.border};
  box-shadow: ${({ theme }) => theme.baseTheme.sideMenu.userNavigate.boxShadow};
  background-color: ${({ theme }) =>
    theme.baseTheme.sideMenu.userNavigate.backgroundColor};

  .header {
    padding: 12px 14px;
    align-items: center;
    border-bottom: ${({ theme }) =>
      theme.baseTheme.sideMenu.userNavigate.title.border};
    color: ${({ theme }) => theme.baseTheme.sideMenu.userNavigate.title.color};
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
      gap: 8px;
      align-self: stretch;
      border-radius: 4px;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      color: ${({ theme }) =>
        theme.baseTheme.sideMenu.userNavigate.content.color};

      &:hover {
        background-color: ${({ theme }) =>
          theme.baseTheme.sideMenu.userNavigate.content.hoverBackgroundColor};
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
        theme.baseTheme.sideMenu.userNavigate.footer.text.color};
    }

    &-icon {
      display: flex;
      padding: 3px;
      justify-content: center;
      align-items: flex-start;
      gap: 4px;
      border-radius: 100px;
      border: ${({ theme }) =>
        theme.baseTheme.sideMenu.userNavigate.footer.iconWrapper.border};
      background-color: ${({ theme }) =>
        theme.baseTheme.sideMenu.userNavigate.footer.iconWrapper
          .backgroundColor};

      &-wrapper {
        display: flex;
        width: 26px;
        height: 26px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        color: ${({ theme }) =>
          theme.baseTheme.sideMenu.userNavigate.footer.iconWrapper.color};
        border-radius: 100px;
        transition: background-color 0.3s ease;
      }

      &-active {
        background-color: ${({ theme }) =>
          theme.baseTheme.sideMenu.userNavigate.footer.iconWrapper
            .activeBackgroundColor};
        color: ${({ theme }) =>
          theme.baseTheme.sideMenu.userNavigate.footer.iconWrapper.activeColor};
      }
    }
  }
`;

export const VersionModalDescribeTextStyleWrapper = styled(Typography.Text)`
  white-space: pre-line;
`;

export const CEModeProjectWrapperStyleWrapper = styled('div')`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 8px;
  height: 36px;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  border-radius: 4px;

  .project-flag-icon {
    margin-right: 8px;
    color: ${({ theme }) =>
      theme.baseTheme.sideMenu.projectSelector.dropdown.activeIconColor};
  }
`;

export const VersionModalStyleWrapper = styled(BasicModal)`
  &.version-modal {
    width: 720px !important;
  }
`;
