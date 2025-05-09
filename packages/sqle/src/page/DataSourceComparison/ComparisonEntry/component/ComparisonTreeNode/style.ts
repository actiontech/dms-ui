import { styled } from '@mui/material/styles';
import { Card } from 'antd';

export const ComparisonTreeContainerStyleWrapper = styled('div')`
  display: flex;
`;

export const ComparisonTreeItemStyleWrapper = styled(Card)`
  &.ant-card {
    max-width: 50%;
    flex: 1;
    overflow-y: auto;

    &:first-of-type {
      margin-right: 24px !important;
    }

    .ant-card-head {
      border-bottom: 0 !important;
      padding: 16px !important;
    }

    .ant-card-body {
      padding-top: 4px !important;

      .ant-tree {
        .ant-tree-switcher {
          display: flex;
          align-items: center;
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
      }
    }
  }
`;

export const ComparisonTreeNodeTitleStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  width: 320px;
  min-height: 24px;
  height: 100%;
  padding: 8px 12px !important;
  border-radius: 4px;

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
    height: 26px;

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

  &.inconsistent {
    .name-container .content {
      color: ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node
          .inconsistent.color};
    }
  }

  &.baseline-inconsistent {
    background: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node
        .inconsistent.baselineBgColor};
  }

  &.comparison-inconsistent {
    background: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node
        .inconsistent.comparisonBgColor};
  }

  &.missing-comparison {
    .name-container .content {
      color: ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node
          .missing.color};
    }
  }

  &.baseline-missing-comparison {
    background: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node.missing
        .baselineBgColor};
  }

  &.comparison-missing-comparison {
    background: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node.missing
        .comparisonBgColor};
  }

  &.new-comparison {
    .name-container .content {
      color: ${({ theme }) =>
        theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node.new
          .color};
    }

    background: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node.new
        .bgColor};
  }

  &.highlight {
    animation: highlight-animation 2s ease-in-out;
  }

  @keyframes highlight-animation {
    0% {
      opacity: 1;
      transform: scale(1);
    }

    20% {
      opacity: 0.1;
      transform: scale(1.06);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .status-tag {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    gap: 4px;
    white-space: nowrap;
  }

  .tag-inconsistent {
    color: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node.tag
        .inconsistent.color};
    background: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node.tag
        .inconsistent.bgColor};
  }

  .tag-missing {
    color: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node.tag
        .missing.color};
    background: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node.tag
        .missing.bgColor};
  }

  .tag-new {
    color: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node.tag.new
        .color};
    background: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.node.tag.new
        .bgColor};
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

export const ComparisonTreeTitleStyleWrapper = styled('div')`
  padding: 12px 16px;
  background: ${({ theme }) =>
    theme.sqleTheme.dataSourceComparison.comparisonEntry.treeNode.title
      .bgColor};
  border-radius: 6px;
  display: flex;
  align-items: center;
`;
