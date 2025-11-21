import { FormStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { styled } from '@mui/material/styles';
import { BasicButton } from '@actiontech/shared';

export const SqlInfoFormStyleWrapper = styled(FormStyleWrapper)`
  .custom-icon-ellipse {
    display: none;
  }

  .form-item-label-mb-16 {
    margin-bottom: 16px !important;
  }

  .data-source-row-select {
    width: 300px !important;
  }

  .data-source-row-divider {
    height: 36px !important;
    margin: 0 !important;
  }

  .data-source-row-button {
    height: 36px !important;
    width: 36px !important;
  }

  .data-source-col-delete-button {
    width: 35px !important;
  }

  .data-source-row-rule-template {
    height: 36px !important;
    width: 36px !important;
  }

  .high-analysis-checkbox.ant-checkbox-wrapper {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  }
`;

export const SqlFormatterButtonStyleWrapper = styled(BasicButton)`
  &.ant-btn.basic-button-wrapper.active-formatter-button {
    color: ${({ theme }) =>
      theme.sqleTheme.order.createOrder.auditResult.toggleButton.activeColor};
    background: ${({ theme }) =>
      theme.sqleTheme.order.createOrder.auditResult.toggleButton.activeBgColor};
  }
`;
