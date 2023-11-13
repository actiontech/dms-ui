import { styled } from '@mui/material/styles';

export const WorkflowTemplateDetailRightContentStyleWrapper = styled('div')`
  padding: 0 24px;
`;

export const WorkflowTemplateAuthLevelStyleWrapper = styled('div')`
  padding: 32px 0 22px;
  border-bottom: ${({ theme }) =>
    theme.sqleTheme.workflowTemplate.workflowTemplateAuthInfo.borderBottom};

  .top-auth-level {
    font-weight: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.workflowTemplateAuthInfo
        .topLevelFontWeight};
    display: flex;
    margin-bottom: 12px;
  }

  .ant-typography.auth-level-text {
    font-weight: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.workflowTemplateAuthInfo
        .authLevelFontWeight};
    font-size: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.workflowTemplateAuthInfo
        .authLevelFontSize};
  }

  .ant-progress-steps-outer {
    position: relative;
    top: -10px;

    .ant-progress-steps-item:first-of-type {
      border-radius: 50px 0 0 50px;
    }

    .ant-progress-steps-item:last-of-type {
      border-radius: 0 50px 50px 0;
    }
  }
`;

export const WorkflowTemplateAuthInfoStyleWrapper = styled('div')`
  padding: 24px 0;
  border-bottom: ${({ theme }) =>
    theme.sqleTheme.workflowTemplate.workflowTemplateAuthInfo.borderBottom};

  .ant-typography.auth-info-title {
    font-weight: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.workflowTemplateAuthInfo
        .topLevelFontWeight};
    line-height: 22px;
    display: flex;
    flex: 1 0 0;
  }

  .ant-typography.auth-info-item {
    margin: 12px 0 0;
    color: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.workflowTemplateAuthInfo.authInfoColor};
    font-size: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.workflowTemplateAuthInfo
        .authInfoFontSize};
    line-height: 20px;

    .auth-info-item-icon {
      list-style-type: disc;
    }

    &.auth-info-time {
      display: flex;
      align-items: center;
    }

    .update-time {
      font-size: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.workflowTemplateAuthInfo
          .authInfoFontSize};
      font-weight: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.workflowTemplateAuthInfo
          .topLevelFontWeight};
      margin-left: 6px;
      line-height: 20px;
    }
  }
`;
