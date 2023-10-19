import { styled } from '@mui/material/styles';
import { Typography } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const TypographyStyleWrapper = styled(Typography.Paragraph)`
  max-width: 100%;

  &.${ANTD_PREFIX_STR}-typography.${ANTD_PREFIX_STR}-typography-ellipsis {
    margin-bottom: 0;
    display: flex;
    align-items: center;

    span:not(.anticon-copy):first-of-type {
      display: inline-flex;
      overflow: hidden;
      word-break: keep-all;
    }

    .${ANTD_PREFIX_STR}-typography-copy {
      height: 18px;
      width: 18px;
      opacity: 0;
      border-radius: 4px;
      margin-inline-start: 10px;

      &:hover {
        opacity: 1;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        background-color: ${({ theme }) =>
          theme.sharedTheme.basic.colorPrimaryBgHover} !important;
      }
    }

    &:hover {
      .${ANTD_PREFIX_STR}-typography-copy {
        opacity: 1;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      }
    }
  }
`;
