import { styled } from '@mui/material';

export const PrivilegesFieldStyleWrapper = styled('section')`
  & .ant-table-wrapper.actiontech-table-namespace {
    padding-bottom: 0 !important;
  }
`;

export const PrivilegesFieldTitleStyleWrapper = styled('section')`
  padding: 14px 0;
  border-bottom: ${({ theme }) => theme.sharedTheme.components.toolbar.border};
  border-top: ${({ theme }) => theme.sharedTheme.components.toolbar.border};
  display: flex;

  .privileges-field-title {
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
    flex: 1;
  }
`;
