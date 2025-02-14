import { styled } from '@mui/material/styles';
import { Space } from 'antd';

export const KnowledgeSearchBarStyleWrapper = styled('div')`
  width: 100%;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  border-radius: 10px;
  padding: 12px;

  .basic-input-wrapper {
    resize: none !important;
    margin: 12px 0;
    overflow: hidden;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;

    .search-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export const KnowledgeTagSelectorBarStyleWrapper = styled(Space)`
  margin-bottom: 12px;
  padding: 0 11px;

  .popover-target {
    cursor: pointer;
    display: flex;
    align-items: center;

    span {
      font-size: 14px;
    }
  }
`;

export const KnowledgeSearchTagsPopoverStyleWrapper = styled(Space)`
  width: 300px;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  max-height: 400px;

  & .ant-space-item {
    width: 100%;
    padding: 0 12px;

    &:last-of-type {
      flex: 1;
      height: 400px;
      overflow: auto;
      padding-top: 8px;
      border-top: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    }
  }

  & .ant-space-item .ant-checkbox-group {
    width: 100%;
    display: flex;
    flex-direction: column;

    .ant-checkbox-wrapper {
      width: 100%;

      span:not(.ant-checkbox) {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  & .ant-input-clear-icon {
    display: flex;
  }
`;
