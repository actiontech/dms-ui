import { styled } from '@mui/material/styles';

export const EnvironmentSelectStyleWrapper = styled('div')`
  max-width: 50%;
  display: flex;
  flex: 1;
  flex-direction: column;

  &:first-of-type {
    margin-right: 24px;
  }

  .environment-section-desc {
    margin-bottom: 8px;
    white-space: pre-line;
  }
`;
