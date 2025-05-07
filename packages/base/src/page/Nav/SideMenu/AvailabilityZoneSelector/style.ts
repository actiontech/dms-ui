import { styled } from '@mui/material/styles';

export const AvailabilityZoneSelectorStyleWrapper = styled('div')`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  width: 66px;
  margin-left: 4px;

  .text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 4px;
  }
`;

export const AvailabilityZoneMenuStyleWrapper = styled('div')`
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: ${({ theme }) =>
    theme.baseTheme.sideMenu.availabilityZoneSelector.dropdown.boxShadowColor};
  min-width: 220px;

  .search-container {
    .ant-input-affix-wrapper {
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
      border-radius: 4px;

      &:hover,
      &:focus {
        background-color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorFillSecondary};
      }
    }
  }

  .divider {
    height: 1px;
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorBorderSecondary};
    margin: 4px 0;
  }

  .zones-container {
    max-height: 240px;
    overflow-y: auto;

    .zone-item {
      padding: 8px 16px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorFillTertiary};

        .icon:not(.selected) {
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        }
      }

      &.selected {
        background-color: ${({ theme }) =>
          theme.sharedTheme.basic.colorPrimaryBgActive};
        font-weight: 600;

        .icon {
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        }
      }

      .icon {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
        margin-right: 8px;
      }
    }
  }

  .empty-container {
    padding: 16px;
    display: flex;
    justify-content: center;
  }
`;
