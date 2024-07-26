import { styled } from '@mui/material/styles';
import { Space } from 'antd';

export const ToggleTokensStyleWrapper = styled(Space)`
  .toggle-token-item {
    width: 100%;
  }

  .toggle-token-item.toggle-token-item-with-checkbox {
    .toggle-token-item-with-checkbox-children {
      display: flex;
      justify-content: center;
      align-items: center;

      .toggle-token-item-label {
        margin-left: 8px;
      }
    }
  }

  .toggle-token-item-no-style {
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
  }

  .toggle-token-item-no-style.toggle-token-item-checked {
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorWhite};
  }
`;
