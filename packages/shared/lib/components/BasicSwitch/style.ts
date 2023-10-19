import { styled } from '@mui/material/styles';
import { Switch } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const BasicSwitchStyleWrapper = styled(Switch)`
  &.basic-switch-wrapper.${ANTD_PREFIX_STR}-switch {
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorFill};

    &:focus {
      outline: none;
    }
  }

  &.basic-switch-wrapper.${ANTD_PREFIX_STR}-switch-disabled {
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillSecondary};
  }
`;
