import { styled } from '@mui/material/styles';

export const AuthListStyleWrapper = styled('div')`
  .auth-action-column {
    .template-name-tag {
      cursor: pointer;
    }

    .auth-action-column-editor {
      opacity: 0;
    }

    &:hover {
      .auth-action-column-editor {
        opacity: 1;
      }
    }
  }
`;
