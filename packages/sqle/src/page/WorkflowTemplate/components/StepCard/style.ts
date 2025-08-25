import { BasicButton } from '@actiontech/dms-kit';
import { styled } from '@mui/material/styles';
import { Card } from 'antd';
export const StepCardStyleWrapper = styled(Card)`
  display: flex;
  width: 480px;
  padding: 20px 24px 16px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 8px;

  &.ant-card.step-card-style {
    box-shadow: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.boxShadow};
    background-color: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.backgroundColor};

    &.ant-card-hoverable:hover {
      box-shadow: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.stepCard.hoverBoxShadow};
    }

    &.disable-step-card {
      border: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.stepCard.disableBorder};
      background-color: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.stepCard.disabledBackgroundColor};

      &:hover {
        background-color: ${({ theme }) =>
          theme.sqleTheme.workflowTemplate.stepCard
            .disableHoverBackgroundColor};
      }
    }

    .ant-card-body {
      width: 100%;
      position: relative;
    }
  }

  .step-card-title {
    font-weight: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.cardTitleFontWeight};
    line-height: 22px;
  }

  div.step-card-desc {
    margin: 8px 0 0;
    color: ${({ theme }) => theme.sqleTheme.workflowTemplate.stepCard.cardDesc};
    font-size: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.descFontSize};
    line-height: 20px;
    word-wrap: break-word;
  }

  div.step-card-operator {
    display: flex;
    margin-top: 16px;
    padding-top: 12px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    border-top: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.cardOperator.borderTop};

    .operator-title {
      color: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.stepCard.cardOperator.titleColor};
      font-size: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.stepCard.descFontSize};
      font-weight: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.stepCard.operatorTitleFontWeight};
      line-height: 20px;
    }

    .operator-content {
      display: flex;
      align-items: center;
      height: 32px;

      .work-flow-auth-avatar-wrapper:not(:last-child) {
        margin-right: -5px;

        .ant-avatar {
          border: ${({ theme }) =>
            theme.sqleTheme.workflowTemplate.stepCard.userAvatarBorder};
        }
      }
    }
  }
`;
export const WorkflowTemplateStepInfoStyleWrapper = styled('div')`
  padding: 40px 0;
  display: flex;
  flex-direction: column;

  .ant-row.next-step-icon {
    flex-direction: column;
    align-items: center;
    margin: 12px 0 12px 40px;
  }

  .workflow-step-container {
    position: relative;
    justify-content: center;
    align-items: flex-start;
  }

  .workflow-step-container.workflow-card-space:not(:last-child) {
    margin-bottom: 16px;
  }

  .workflow-step-container:not(:last-child) {
    ::after {
      content: '';
      position: absolute;
      top: 55px;
      left: calc(50% - 248px);
      width: 1px;
      height: calc(100% - 33px);
      background-color: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.stepCard.stepLineColor};
    }
  }

  .workflow-step-container:not(:first-of-type) {
    ::before {
      content: '';
      position: absolute;
      top: -54px;
      left: calc(50% - 248px);
      width: 1px;
      height: 60px;
      background-color: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.stepCard.stepLineColor};
    }
  }

  .icon-wrapper {
    span {
      display: flex;
      width: 24px;
      height: 24px;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      margin-top: 19px;
    }

    .honour-icon {
      background-color: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.step.honour};
    }

    .add-file-icon {
      background-color: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.step.addFile};
    }

    .audit-icon {
      background-color: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.step.audit};
    }

    .send-plane-icon {
      background-color: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.step.sendPlane};
    }
  }

  .step-box {
    display: flex;
    padding: 0 0 0 16px;
    border-radius: 8px;

    .ant-row {
      flex: 1;
    }

    .content-wrapper {
      padding: 16px 0 16px 40px;

      .desc {
        font-size: ${({ theme }) =>
          theme.sqleTheme.workflowTemplate.stepCard.descFontSize};
        line-height: 20px;
      }
    }
  }

  .review-exec-auth-text {
    margin-left: 4px;
    font-size: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.descFontSize};
    color: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.authTextColor};
    font-weight: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.operatorTitleFontWeight};
  }

  span.review-index-text {
    color: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.stepReviewIndexTextColor};
    font-weight: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.stepReviewIndexTextFontWeight};
    margin-left: 5px;
  }

  .add-review-node-icon {
    margin-bottom: 16px;

    &.workflow-step-container {
      ::before {
        top: -34px;
      }
    }
  }
`;
export const TemplateLevelStyleWrapper = styled('div')`
  .level-step-desc {
    width: 60px;
    margin-right: 16px;
  }
`;
export const ReviewNodeCloseButton = styled(BasicButton)`
  &.basic-button-wrapper.ant-btn.ant-btn-circle.ant-btn-icon-only {
    width: 24px;
    height: 24px;
    position: absolute;
    right: -8px;
    top: -8px;
    min-width: 24px;
    box-shadow: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.stepCard.closeButtonBoxShadow};

    .anticon {
      font-size: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.stepCard.closeButtonFontSize};
    }
  }
`;
