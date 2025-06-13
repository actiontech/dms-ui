import { styled } from '@mui/material/styles';

export const ManageMemberGroupContainer = styled('div')`
  max-height: 400px;
  overflow-y: auto;
`;

export const MemberGroupCard = styled('div')`
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  border-radius: 8px;

  .member-group-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .member-group-content {
    flex: 1;
  }

  .member-group-title {
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
  }

  .permissions-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .action-buttons {
    flex-shrink: 0;
  }
`;
