import { FormStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';
import { styled } from '@mui/material/styles';

export const ModifySqlStatementFormStyleWrapper = styled(FormStyleWrapper)`
  .workflow-desc-form-item {
    margin-bottom: 24px;

    .ant-form-item-label > label {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
      font-weight: 500;
    }
  }

  .custom-icon-ellipse {
    display: none;
  }

  .form-item-label-mb-16 {
    margin-bottom: 16px !important;
  }
`;
