import { styled } from '@mui/material/styles';
import { InputNumber } from 'antd';

export const BasicInputNumberStyleWrapper = styled(InputNumber)`
  &.basic-inputNumber-wrapper.ant-input-number {
    font-size: 14px;
    border-radius: 4px;
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicInput.default.border};
    width: 100%;

    &::placeholder {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.default.placeholder.color};
    }

    &:focus {
      outline: none;
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.focus.border} !important;
    }

    &[disabled] {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.disabled.border};
    }
  }
`;
