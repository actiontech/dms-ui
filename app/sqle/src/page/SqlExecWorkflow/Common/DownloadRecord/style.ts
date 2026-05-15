import { styled } from '@mui/material';

export const DownloadDropdownStyleWrapper = styled('div')`
  display: flex;
  padding: 6px;
  flex-direction: column;
  align-items: start;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) =>
      theme.sqleTheme.execWorkflow.create.auditResult.download.borderColor};
  background: ${({ theme }) =>
    theme.sqleTheme.execWorkflow.create.auditResult.download.bgColor};
  box-shadow: ${({ theme }) =>
    theme.sqleTheme.execWorkflow.create.auditResult.download.boxShadow};

  .download-record-item {
    cursor: pointer;
    display: flex;
    height: 32px;
    padding: 0 10px;
    align-items: center;
    align-self: stretch;
    overflow: hidden;
    color: ${({ theme }) =>
      theme.sqleTheme.execWorkflow.create.auditResult.download.itemColor};
    text-overflow: ellipsis;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    transition: background-color 0.3s;

    &:hover {
      border-radius: 4px;
      background: ${({ theme }) =>
        theme.sqleTheme.execWorkflow.create.auditResult.download
          .itemHoverColor};
    }

    &-icon {
      margin-right: 6px;
      color: ${({ theme }) =>
        theme.sqleTheme.execWorkflow.create.auditResult.download.itemIconColor};
    }
  }
`;
