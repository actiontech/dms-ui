import { styled } from '@mui/material/styles';
import { Segmented } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const SegmentedStyleWrapper = styled(Segmented)`
  &.${ANTD_PREFIX_STR}-segmented.basic-segmented-wrapper {
    display: flex;
    height: 28px;
    align-items: center;
    border-radius: 4px;
    padding: 0;
    color: ${({ theme }) => theme.sharedTheme.components.basicSegmented.color};
    font-weight: 500;
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.basicSegmented.backgroundColor};

    .${ANTD_PREFIX_STR}-segmented-group {
      .${ANTD_PREFIX_STR}-segmented-item:not(.${ANTD_PREFIX_STR}-segmented-item-selected) {
        &:hover {
          color: ${({ theme }) =>
            theme.sharedTheme.components.basicSegmented.color};
          background-color: ${({ theme }) =>
            theme.sharedTheme.components.basicSegmented.hoverBackgroundColor};
        }
      }

      .${ANTD_PREFIX_STR}-segmented-item:hover:not(.${ANTD_PREFIX_STR}-segmented-item-selected):not(
          .${ANTD_PREFIX_STR}-segmented-item-disabled
        )::after {
        background-color: transparent !important;
      }

      .${ANTD_PREFIX_STR}-segmented-item-selected {
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicSegmented.active.color};
        border: ${({ theme }) =>
          theme.sharedTheme.components.basicSegmented.active.border};
        box-shadow: ${({ theme }) =>
          theme.sharedTheme.components.basicSegmented.active.boxShadow};
      }
    }

    .${ANTD_PREFIX_STR}-segmented-item-label {
      font-size: 13px;

      .notice-count {
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicSegmented.noticeCountColor};
      }
    }
  }
`;
