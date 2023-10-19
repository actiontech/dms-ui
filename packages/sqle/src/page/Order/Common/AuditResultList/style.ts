import { styled } from '@mui/material/styles';

export const AuditResultForCreateOrderStyleWrapper = styled('section')`
  .audit-result-describe-column {
    max-width: 600px;
  }

  .audit-result-exec-sql-column,
  .audit-result-column {
    max-width: 500px;
    cursor: pointer;
  }

  .instance-segmented-label {
    display: flex;
    align-items: center;

    &-icon {
      display: flex;
      align-items: center;
      margin-left: 4px;
    }
  }
`;
