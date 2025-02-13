import { styled } from '@mui/material/styles';
import { Checkbox } from 'antd';

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

  .search-header {
    margin-bottom: 12px;
  }

  .search-footer {
    margin-top: 8px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .switch-control {
      border: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
      border-radius: 10px;
      padding: 6px;
      font-size: 12px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    }

    .pointer {
      cursor: pointer;
    }

    .popover-target {
      cursor: pointer;
      display: flex;
      align-items: center;

      span {
        font-size: 14px;
      }
    }
  }
`;

export const KnowledgeSearchTagsPopoverStyleWrapper = styled(Checkbox.Group)`
  .ant-checkbox-wrapper {
    width: 100%;
  }
`;
