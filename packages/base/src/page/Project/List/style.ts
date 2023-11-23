import { styled } from '@mui/material/styles';
import { Typography } from 'antd';

export const ProjectDescStyledWrapper = styled(Typography.Paragraph)`
  max-width: 100%;

  &.ant-typography.ant-typography-ellipsis {
    margin-bottom: 0;
  }
`;

export const ProjectArchiveStyledWrapper = styled('div')`
  .project-flag-icon {
    color: ${({ theme }) =>
      theme.baseTheme.sideMenu.projectSelector.dropdown.activeIconColor};
  }
`;
