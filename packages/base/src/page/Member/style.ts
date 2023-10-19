import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';
import { Space } from 'antd5';
import { BasicDrawer } from '@actiontech/shared';

export const ProjectMemberStyleWrapper = styled('section')`
  .${ANTD_PREFIX_STR}-tabs-nav {
    margin-bottom: 0 !important;
    padding-left: 24px;
  }
`;

export const FormListDeleteIconWrap = styled('section')`
  height: 36px;
  width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: ${({ theme }) =>
    theme.sharedTheme.components.basicSelect.default.border};
  cursor: pointer;

  &:hover {
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicSelect.hover.border};
  }
`;

export const MemberDrawerStyledWrapper = styled(BasicDrawer)`
  .member-form-add-button {
    background-color: ${({ theme }) =>
      theme.sharedTheme.basic.colorPrimaryBgHover} !important;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary} !important;
  }
`;

export const MemberListIsAdminStyledWrapper = styled(Space)`
  .${ANTD_PREFIX_STR}-space-item:first-of-type {
    display: flex;
  }
`;
