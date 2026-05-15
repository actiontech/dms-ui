import { FormStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';
import { styled } from '@mui/material/styles';

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
    .ant-checkbox {
      align-self: flex-start;
      margin-top: 4px;
    }

    .high-analysis-checkbox-tips,
    .high-analysis-checkbox-label {
      display: block;
    }

    .high-analysis-checkbox-tips {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      font-size: 12px;
      margin-top: 6px;
    }
  }
`;
