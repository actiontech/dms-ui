import { styled } from '@mui/material/styles';
import { Row } from 'antd';
import { BasicDrawer } from '@actiontech/shared';

export const ProjectMemberStyleWrapper = styled('section')`
  .ant-tabs-nav {
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

export const MemberRoleSelectorRowStyleWrapper = styled(Row)`
  .ant-col {
    height: 100%;
  }
`;
