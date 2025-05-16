import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { styled } from '@mui/material/styles';

export const SqlManagementTableStyleWrapper = styled(ActiontechTable)<{
  hasAbnormalAuditPlan: boolean;
}>`
  .ant-table-body {
    max-height: ${(hasAbnormalAuditPlan) =>
      `calc(100vh - ${hasAbnormalAuditPlan ? '388px' : '338px'}) !important`};
  }

  .audit-status .ant-tag {
    width: fit-content;
  }
`;

export const AbnormalAuditPlanTipsStyleWrapper = styled('div')`
  padding: 10px 40px 0;

  & .ant-alert {
    align-items: flex-start !important;

    .ant-alert-icon {
      margin-top: 4px;
    }
  }
`;
