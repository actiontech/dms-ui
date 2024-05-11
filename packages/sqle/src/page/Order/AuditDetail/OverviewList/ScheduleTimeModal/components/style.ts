import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { styled } from '@mui/material/styles';

export const ConfirmMethodFormItemLabelStyleWrapper = styled(FormItemLabel)`
  .ant-form-item-row {
    .ant-form-item-required {
      &::after {
        display: none !important;
      }
    }
  }
`;
