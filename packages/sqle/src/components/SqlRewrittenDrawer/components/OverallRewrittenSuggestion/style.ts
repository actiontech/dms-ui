import { styled } from '@mui/material';
import { Alert } from 'antd';

export const OverallRewrittenItemStyleWrapper = styled('div')`
  margin-bottom: 18px;
`;

export const OverallRewrittenTitleStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .title-wrapper {
    display: flex;
    align-items: center;

    .title-text {
      margin-left: 8px;
      font-weight: 500;
      font-size: 16px;
    }
  }

  .action-items-wrapper {
    display: flex;

    .toggle-button-wrapper {
      margin-left: 12px;
    }
  }
`;

export const BusinessWarningStyleWrapper = styled(Alert)`
  box-shadow: 0 4px 8px
    ${({ theme }) => theme.sharedTheme.basic.colorShadowByWhite};

  .ant-alert-content {
    white-space: pre-line;

    .wmde-markdown {
      color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorTextBase} !important;
      background-color: transparent;
      font-size: 14px;
    }
  }
`;
