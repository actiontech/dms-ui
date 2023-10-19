import { styled } from '@mui/material/styles';
import { Empty } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const EmptyStyleWrapper = styled(Empty)`
  &.is-icon-tips {
    .${ANTD_PREFIX_STR}-empty-image {
      height: auto !important;
      margin-bottom: 0 !important;
    }

    .${ANTD_PREFIX_STR}-empty-description {
      display: flex;
      flex-direction: column;

      &,
      * {
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicEmpty.description};
      }
    }

    .no-data-title {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicEmpty.title.color};
      font-size: ${({ theme }) =>
        theme.sharedTheme.components.basicEmpty.title.fontSize};
      font-weight: ${({ theme }) =>
        theme.sharedTheme.components.basicEmpty.title.fontWeight};
    }

    .no-data-cont {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicEmpty.info.color};
      font-size: ${({ theme }) =>
        theme.sharedTheme.components.basicEmpty.info.fontSize};
      font-weight: ${({ theme }) =>
        theme.sharedTheme.components.basicEmpty.info.fontWeight};

      &.tip-without-title {
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicEmpty.title.color};
      }
    }
  }
`;
