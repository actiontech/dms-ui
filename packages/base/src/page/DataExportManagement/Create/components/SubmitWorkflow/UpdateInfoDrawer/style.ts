import { FormStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { styled } from '@mui/material/styles';
import {
  EditBaseInfoFormStyleWrapper,
  EditOrderFormTitleStyleWrapper
} from 'sqle/src/page/Order/Create/EditSQLInfoDrawer/style';

export const UpdateTaskInfoFormTitleStyleWrapper = styled(
  EditOrderFormTitleStyleWrapper
)``;

export const UpdateBseInfoFormStyleWrapper = styled(
  EditBaseInfoFormStyleWrapper
)``;

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
