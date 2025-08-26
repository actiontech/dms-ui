import { styled } from '@mui/material/styles';
import { Segmented } from 'antd';

export const SegmentedStyleWrapper = styled(Segmented)`
  &.ant-segmented.basic-segmented-wrapper {
    display: flex;
    height: 28px;
    align-items: center;
    border-radius: 4px;
    padding: 0;
    color: ${({ theme }) => theme.sharedTheme.components.basicSegmented.color};
    font-weight: 500;
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.basicSegmented.backgroundColor};

    .ant-segmented-group {
      .ant-segmented-item:not(.ant-segmented-item-selected) {
        &:hover {
          color: ${({ theme }) =>
            theme.sharedTheme.components.basicSegmented.color};
          background-color: ${({ theme }) =>
            theme.sharedTheme.components.basicSegmented.hoverBackgroundColor};
        }
      }

      .ant-segmented-item:hover:not(.ant-segmented-item-selected):not(
          .ant-segmented-item-disabled
        )::after {
        background-color: transparent !important;
      }

      .ant-segmented-item-selected {
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicSegmented.active.color};
        border: ${({ theme }) =>
          theme.sharedTheme.components.basicSegmented.active.border};
        box-shadow: ${({ theme }) =>
          theme.sharedTheme.components.basicSegmented.active.boxShadow};
      }
    }

    .ant-segmented-item-label {
      font-size: 13px;

      .notice-count {
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicSegmented.noticeCountColor};
      }
    }
  }
`;
