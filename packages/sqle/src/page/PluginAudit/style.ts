import { styled } from '@mui/material/styles';
import { Space } from 'antd';

export const PluginAuditDefaultPromptsWrapper = styled(Space)`
  width: 100%;
  margin-top: 32px;

  .step-wrap {
    margin-top: 32px;
    width: 800px;
    padding: 24px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;

    & .ant-steps {
      margin-bottom: 24px;
    }
  }
`;
