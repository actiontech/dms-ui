import { styled } from '@mui/material/styles';
import { Button } from 'antd';

export const GuidanceButtonStyleWrapper = styled(Button)`
  &.guidance-button-wrapper.ant-btn.ant-btn-sm {
    padding: 0 10px;
  }

  /* default */
  &.guidance-button-wrapper.ant-btn.ant-btn-default {
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

      .ant-space-item {
        color: ${({ theme }) =>
          theme.baseTheme.guidance.guidanceButton.hover.color};
      }
    }
  }
`;
