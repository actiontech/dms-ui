import { FormStyleWrapper } from '@actiontech/shared/lib/components/CustomForm/style';
import { styled } from '@mui/material/styles';
import { Form } from 'antd';

export const UpdateTaskInfoFormTitleStyleWrapper = styled('div')`
  color: ${({ theme }) =>
    theme.sqleTheme.execWorkflow.create.editForm.titleColor};
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  margin-bottom: 24px;
`;

export const UpdateBseInfoFormStyleWrapper = styled(Form)`
  padding: 24px 24px 0 !important;

  .ant-input.basic-input-wrapper.workflow-name-input-wrapper {
    border: none !important;
    padding: 0 0 16px !important;
  }

  .workflow-base-info-desc-form-item {
    margin-bottom: 0 !important;

    .ant-input-affix-wrapper {
      border: none !important;

      &:focus {
        box-shadow: none !important;
      }
    }
  }

  .base-info-form-item-slot {
    margin-bottom: 16px;
  }

  .ant-form-item {
    .ant-form-item-label {
      display: none !important;
    }
  }
`;

export const UpdateSourceInfoFormStyleWrapper = styled(FormStyleWrapper)`
  padding: 0 24px 24px !important;

  .custom-icon-ellipse {
    margin-right: 8px;
  }
`;

export const UpdateMethodInfoFormStyleWrapper = styled(FormStyleWrapper)`
  padding: 0 24px 24px !important;
`;

export const UpdateInfoActionStyleWrapper = styled('div')`
  padding: 0 24px 24px !important;
`;
