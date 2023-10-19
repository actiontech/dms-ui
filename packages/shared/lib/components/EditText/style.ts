import { styled } from '@mui/material/styles';
import { Typography } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const EditTextStyleWrapper = styled(Typography.Paragraph)`
  max-width: 100%;

  &.${ANTD_PREFIX_STR}-typography {
    display: flex;
    align-items: center;
    margin-bottom: 0 !important;
    max-width: 100% !important;

    span:not(.custom-icon-edit):first-of-type {
      display: inline-flex;
      overflow: hidden;
      word-break: keep-all;
      max-width: 96% !important;
    }

    .${ANTD_PREFIX_STR}-typography-edit {
      display: inline-flex !important;
      right: 8px;
      position: absolute;
      width: 22px;
      height: 22px;
      justify-content: center;
      align-items: center;
      border-radius: 4px;

      &:hover {
        background-color: ${({ theme }) =>
          theme.sharedTheme.basic.colorPrimaryBgHover} !important;
        color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorPrimary} !important;
      }
    }
  }
`;
