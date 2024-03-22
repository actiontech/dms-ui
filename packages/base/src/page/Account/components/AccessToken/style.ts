import { ConfigItemStyledWrapper } from '@actiontech/shared/lib/components/ConfigItem/style';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { styled } from '@mui/material/styles';

export const AccessTokenConfigStyleWrapper = styled(ConfigItemStyledWrapper)`
  display: flex;
  flex-direction: column;

  &.clear-padding-top {
    padding-top: 16px;
  }

  .label-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .token-content {
    width: 100%;

    &-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 48px;

      &-label {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
        font-size: 14px;
      }

      &-value {
        font-size: 14px;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      }
    }
  }
`;

export const AccessTokenModalFormItemLabelStyleWrapper = styled(FormItemLabel)`
  .ant-form-item-row {
    .ant-form-item-required {
      &::after {
        display: none !important;
      }
    }
  }
`;
