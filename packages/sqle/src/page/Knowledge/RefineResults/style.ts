import { styled } from '@mui/material';

export const SearchWrapperStyleWrapper = styled('div')`
  position: fixed;
  top: 60px;
  padding: 0 40px;
  height: 90px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  z-index: 1000;

  .search-input-wrapper {
    width: 100%;
    max-width: 80% !important;
  }
`;

export const ResultWrapperStyleWrapper = styled('div')`
  padding: 174px 40px 24px;

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
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .ant-list-pagination {
    margin-top: 24px;
    text-align: right;
  }
`;
