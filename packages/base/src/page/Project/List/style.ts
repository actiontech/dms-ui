import { styled } from '@mui/material/styles';

export const ProjectArchiveStyledWrapper = styled('div')`
  .project-flag-icon {
    color: ${({ theme }) =>
      theme.baseTheme.sideMenu.projectSelector.dropdown.activeIconColor};
  }
`;
