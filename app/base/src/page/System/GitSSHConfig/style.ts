import { styled } from '@mui/material/styles';

export const GitSSHConfigStyleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  width: 100%;

  & .ant-space:first-of-type {
    margin-bottom: 12px;
  }

  .key-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
