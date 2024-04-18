import { styled } from '@mui/material/styles';
import { Space } from 'antd';

export const ToggleTokensStyleWrapper = styled(Space)`
  .toggle-token-item {
    width: 100%;
  }

  .toggle-token-item.toggle-token-item-with-checkbox {
    justify-content: start !important;

    .ant-checkbox-wrapper {
      margin-right: 8px;

      .ant-checkbox-inner {
        width: 14px;
        height: 14px;
      }
    }
  }
`;
