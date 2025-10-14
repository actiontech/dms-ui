import { styled } from '@mui/material/styles';

export const SuggestionList = styled('ul')`
  text-align: left;
  padding-left: 20px;
  margin: 0;

  li {
    margin-bottom: 8px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};

    &:last-child {
      margin-bottom: 0;
    }
  }
`;
