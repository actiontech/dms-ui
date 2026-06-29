import { styled } from '@mui/material/styles';

export const AuditResultWithRuleExceptionStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;

  .audit-result-content {
    flex: 1;
    min-width: 0;
  }

  .audit-result-action {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease;
  }

  &:hover .audit-result-action {
    opacity: 1;
    visibility: visible;
  }
`;
