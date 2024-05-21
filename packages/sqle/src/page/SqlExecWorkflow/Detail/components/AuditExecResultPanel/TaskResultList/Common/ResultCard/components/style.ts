import { styled } from '@mui/material';
import { Tree } from 'antd';

export const TaskAuditResultTreeStyleWrapper = styled(Tree)`
  &.ant-tree {
    .ant-tree-indent {
      display: none;
    }

    .ant-tree-node-selected {
      background-color: transparent !important;
    }

    .ant-tree-switcher .ant-tree-switcher-leaf-line {
      &::before {
        border-right: 1px solid
          ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
      }

      &::after {
        border-bottom: 1px solid
          ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
      }
    }

    .ant-tree-switcher {
      display: flex;
      align-items: center;
      justify-content: center;

      .ant-tree-switcher-icon {
        margin-bottom: 2px;
      }
    }

    .audit-result-tree-title {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
    }

    .audit-result-text-describe {
      margin-left: 12px;
    }
  }
`;

export const TaskResultDescribeStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  & .result-describe-input.ant-input {
    border: none !important;
    box-shadow: none !important;
    padding-left: 0;
    caret-color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    margin: 0 8px;
    flex: 1;
    left: 0;
    font-size: 13px;
  }
`;
