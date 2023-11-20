import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';
import { Typography } from 'antd5';

export const ProjectDescStyledWrapper = styled(Typography.Paragraph)`
  max-width: 100%;
  &.${ANTD_PREFIX_STR}-typography.${ANTD_PREFIX_STR}-typography-ellipsis {
    margin-bottom: 0;
  }
`;

export const ProjectArchiveStyledWrapper = styled('div')`
  .project-flag-icon {
    color: ${({ theme }) =>
      theme.baseTheme.sideMenu.projectSelector.dropdown.activeIconColor};
  }
`;
