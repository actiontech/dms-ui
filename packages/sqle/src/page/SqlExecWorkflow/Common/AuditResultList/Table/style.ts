import { styled } from '@mui/material/styles';
import { Space } from 'antd';

export const AuditResultDrawerTitleStyleWrapper = styled(`div`)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .audit-result-drawer-number {
    color: ${({ theme }) =>
      theme.sqleTheme.execWorkflow.create.auditResult.auditResultDrawer
        .numberColor};
    font-size: 14px;
    font-weight: 600;
    line-height: 21px;
  }
`;

export const AuditResultBackupPolicyColumnStyleWrapper = styled(Space)`
  & .ant-space-item {
    display: flex;
    align-items: center;
  }

  .backup-policy-editor {
    cursor: pointer;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
  }
`;

export const AuditResultBackupPolicyPopoverContentStyleWrapper = styled(Space)`
  & .ant-space-item:last-of-type {
    display: flex;
    justify-content: end;
  }
`;
