import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';
import { Form } from 'antd5';

export const EditOrderFormTitleStyleWrapper = styled('div')`
  color: ${({ theme }) =>
    theme.sqleTheme.order.createOrder.editForm.titleColor};
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  margin-bottom: 24px;
`;

export const EditBaseInfoFormStyleWrapper = styled(Form)`
  padding: 24px 24px 0 !important;

  .${ANTD_PREFIX_STR}-input.basic-input-wrapper.workflow-name-input-wrapper {
    border: none !important;
    padding: 0 0 16px !important;
  }

  .order-base-info-desc-form-item {
    margin-bottom: 0 !important;
    .${ANTD_PREFIX_STR}-input-affix-wrapper {
      border: none !important;

      &:focus {
        box-shadow: none !important;
      }
    }
  }

  .base-info-form-item-slot {
    margin-bottom: 16px;

    .project-flag-icon {
      color: ${({ theme }) =>
        theme.sqleTheme.order.createOrder.editForm.projectFlagIconColor};
    }
  }

  .${ANTD_PREFIX_STR}-form-item {
    .${ANTD_PREFIX_STR}-form-item-label {
      display: none !important;
    }
  }
`;

export const EditSQLInfoFormStyleWrapper = styled(Form)`
  padding: 0 24px 24px !important;

  .custom-icon-ellipse {
    margin-right: 8px;
  }

  .data-source-row-select {
    width: 276px !important;
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
`;
