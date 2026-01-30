import { FormStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';
import { styled } from '@mui/material';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/dms-kit';
import { FormAreaBlockStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';

export const ModifySqlStatementFormStyleWrapper = styled(FormStyleWrapper)`
  .custom-icon-ellipse {
    display: none;
  }

  .form-item-label-mb-16 {
    margin-bottom: 16px !important;
  }
`;

export const ModifySqlStatementPageStyleWrapper = styled(
  PageLayoutHasFixedHeaderStyleWrapper
)`
  &.mobile-modify-sql-statement-page {
    .actiontech-page-header-namespace {
      width: 100vw !important;
      padding: 0 1rem;
      left: 0;
    }
  }
`;

export const ModifySqlStatementFormAreaBlockStyleWrapper = styled(
  FormAreaBlockStyleWrapper
)`
  &.mobile-modify-sql-statement-form-area-block {
    width: 100vw !important;
    padding: 0 1rem !important;

    .mobile-modify-sql-statement-form-item-big-title {
      padding: 1.5rem 0;
    }

    .ant-form-item {
      margin-bottom: 1rem !important;
    }

    .sql-statement-form-item-label {
      .ant-form-item-label {
        padding: 0 !important;
      }

      .ant-form-item-control-input {
        min-height: 0 !important;
      }
    }

    .actiontech-mode-switcher {
      .actiontech-mode-switcher-item-text {
        font-size: 12px !important;
      }
    }
  }
`;
