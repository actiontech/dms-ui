import { styled } from '@mui/material/styles';
import { Card } from 'antd';

export const ComparisonTreeContainerStyleWrapper = styled('div')`
  display: flex;
`;

export const ComparisonTreeItemStyleWrapper = styled(Card)`
  max-width: 50%;
  flex: 1;
  overflow-y: auto;

  &:first-of-type {
    margin-right: 24px !important;
  }

  .ant-tree-treenode {
    align-items: center !important;

    .ant-tree-checkbox {
      margin-right: 4px !important;
    }

    .ant-tree-node-content-wrapper {
      display: flex;
      align-items: center;
    }
  }
`;

export const ComparisonTreeNodeTitleStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  width: 100%;

  svg {
    min-width: 18px;

    &:first-of-type {
      margin-right: 4px;
    }
  }

  .name-container {
    display: flex;
    align-items: center;
    flex: 1;

    .content {
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 16px;
    }
  }

  .view-detail-icon {
    margin-left: 6px;
    flex-shrink: 0;
    opacity: 0;
  }

  &:hover .view-detail-icon {
    opacity: 1;
  }
`;
