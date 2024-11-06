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
    padding: 0 !important;

    .ant-tree-checkbox {
      margin-right: 4px !important;
    }

    .ant-tree-node-content-wrapper {
      display: flex;
      align-items: center;

      .ant-tree-title {
        min-height: 24px;
      }
    }
  }
`;

export const ComparisonTreeNodeTitleStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 24px;
  height: 100%;

  svg {
    min-width: 18px;

    &:first-of-type {
      margin-right: 4px;
    }
  }

  .name-container {
    padding-left: 8px;
    display: flex;
    align-items: center;
    flex: 1;
    border-radius: 4px;
    height: 100%;

    .content {
      display: inline-block;
      width: 160px;
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 16px;
    }
  }

  &.object-comparison-result-diff {
    background-color: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonResultDiffBackgroundColor};
  }

  .view-detail-icon {
    margin-left: 6px;
    flex-shrink: 0;
    opacity: 0;
    outline-offset: 0;
    transition: all 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
    }
  }

  &:hover .view-detail-icon {
    opacity: 1;
  }
`;
