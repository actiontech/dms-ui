import { styled } from '@mui/material';

export const SearchContentWrapperStyleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  padding-top: 60px;
  height: 100vh;
`;

export const SearchWrapperStyleWrapper = styled('div')`
  padding: 12px 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
`;

export const ResultWrapperStyleWrapper = styled('div')`
  padding: 24px 40px;
  flex: 1;
  overflow: auto;

  .ant-list-item {
    cursor: pointer;
    padding: 24px;
    margin-bottom: 16px;
    border-radius: 8px;
    box-shadow: ${({ theme }) =>
      theme.sqleTheme.knowledgeTheme.result.list.boxShadow};
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    transition: all 0.3s ease;

    &:hover {
      box-shadow: ${({ theme }) =>
        theme.sqleTheme.knowledgeTheme.result.list.hoverBoxShadow};
    }

    .title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    }

    .description {
      font-size: 14px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 4px solid
        ${({ theme }) =>
          theme.sqleTheme.knowledgeTheme.result.description.borderLeftColor};
    }

    .content {
      font-size: 12px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      line-height: 1.6;
      display: flex;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .ant-list-pagination {
    margin-top: 24px;
    text-align: right;
  }
`;
