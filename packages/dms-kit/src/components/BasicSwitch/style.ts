import { styled } from '@mui/material/styles';
import { Switch } from 'antd';

export const BasicSwitchStyleWrapper = styled(Switch)`
  &.basic-switch-wrapper.ant-switch {
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorFill};

    &:focus {
      outline: none;
    }
  }

  &.basic-switch-wrapper.ant-switch-disabled {
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillSecondary};
  }
`;
