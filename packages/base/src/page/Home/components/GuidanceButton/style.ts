import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';
import { Button } from 'antd5';

export const GuidanceButtonStyleWrapper = styled(Button)`
  &.guidance-button-wrapper.${ANTD_PREFIX_STR}-btn.${ANTD_PREFIX_STR}-btn-sm {
    padding: 0 10px;
  }

  /* default */
  &.guidance-button-wrapper.${ANTD_PREFIX_STR}-btn.${ANTD_PREFIX_STR}-btn-default {
    border: none;
    background: ${({ theme }) =>
      theme.baseTheme.guidance.guidanceButton.default.background};
    color: ${({ theme }) =>
      theme.baseTheme.guidance.guidanceButton.default.color};
    /* transition: all 3s ease; */

    &:hover,
    &:focus {
      background: ${({ theme }) =>
        theme.baseTheme.guidance.guidanceButton.hover.background};
      color: ${({ theme }) =>
        theme.baseTheme.guidance.guidanceButton.hover.color};
      .${ANTD_PREFIX_STR}-space-item {
        color: ${({ theme }) =>
          theme.baseTheme.guidance.guidanceButton.hover.color};
      }
    }
  }
`;
