import { styled } from '@mui/material/styles';

export const PushRuleConfigurationStyleWrapper = styled('section')`
  .configuration-wrapper {
    width: 640px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    .configuration-title {
      padding: 60px 0 32px;
      font-size: 24px;
      font-weight: 500;
      line-height: 32px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    }
  }
`;
