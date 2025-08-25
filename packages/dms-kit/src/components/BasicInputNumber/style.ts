import { StyledComponent } from '@emotion/styled';
import { styled, Theme } from '@mui/material/styles';
import { MUIStyledCommonProps } from '@mui/system/createStyled';
import { InputNumber, InputNumberProps } from 'antd';

export const BasicInputNumberStyleWrapper: StyledComponent<
  InputNumberProps & {
    children?: React.ReactNode;
  } & {
    ref?: React.Ref<HTMLInputElement> | undefined;
  } & MUIStyledCommonProps<Theme>,
  {},
  {}
> = styled(InputNumber)`
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
