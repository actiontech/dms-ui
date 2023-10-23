import { BasicButton } from '@actiontech/shared';
import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';

export const UpdateWorkflowTemplateStyleWrapper = styled('div')`
  padding: 0 24px;

  .step-title-wrapper {
    padding: 20px 0;
    border-bottom: 1px solid
      ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo.title
          .titleWrapperBorderBottom};
    margin-bottom: 24px;

    .step-title {
      color: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo.title
          .titleColor};
      font-size: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
          .titleFontSize};
      font-weight: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
          .titleFontWeight};
      line-height: 24px;
    }

    .step-title-info {
      color: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo.title
          .titleInfoColor};
      font-size: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
          .infoFontSize};
      line-height: 20px;
    }
  }

  .step-info-wrapper {
    .info-title {
      color: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo.info
          .titleColor};
      font-weight: ${({ theme }) =>
        theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
          .titleFontWeight};
      line-height: 22px;
      margin-bottom: 8px;
    }

    .step-info-divider {
      margin: 40px 0;
    }

    .authorized-item-switch {
      .${ANTD_PREFIX_STR}-form-item-row {
        flex-direction: row;

        .${ANTD_PREFIX_STR}-form-item-label {
          padding: 0;
          height: 24px;
          line-height: 24px;
        }

        .${ANTD_PREFIX_STR}-form-item-control {
          width: auto;
          text-align: right;

          .${ANTD_PREFIX_STR}-form-item-control-input {
            min-height: 24px;
          }
        }
      }
    }

    .step-desc-textarea {
      min-height: 64px;
    }

    .${ANTD_PREFIX_STR}-form-item .${ANTD_PREFIX_STR}-form-item-label > label {
      font-weight: 500;
    }
  }
`;

export const StepInfoStyleWrapper = styled(BasicButton)`
  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn {
    width: 480px;
    display: flex;
    min-width: 64px;
    padding: 16px 12px;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    border-radius: 8px;
    border: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
        .stepInfoWrapper.border};
    background: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
        .stepInfoWrapper.backgroundColor};
    color: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
        .stepInfoWrapper.textColor};
    margin-left: 40px;
    cursor: pointer;
    height: auto;

    &.${ANTD_PREFIX_STR}-btn:not(.${ANTD_PREFIX_STR}-btn-icon-only)
      > .${ANTD_PREFIX_STR}-btn-icon:not(:last-child) {
      margin-right: 5px;
    }
  }
`;

export const StepButtonStyleWrapper = styled('div')`
  margin-top: 24px;
  display: flex;
  align-items: center;
  align-self: stretch;

  .basic-button-wrapper.${ANTD_PREFIX_STR}-btn:first-of-type {
    margin-right: 12px;
  }
`;

export const StepNodeAlertStyleWrapper = styled('div')`
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) =>
    theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
      .stepNodeAlert.backgroundColor};

  .text-orange {
    margin-right: 6px;
  }

  .${ANTD_PREFIX_STR}-typography.step-alert-title {
    font-weight: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
        .titleFontWeight};
    line-height: 20px;
    display: flex;
    align-items: center;
    font-size: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
        .infoFontSize};
    color: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
        .stepNodeAlert.alertTitleColor};
  }

  .${ANTD_PREFIX_STR}-typography.step-alert-content {
    margin: 8px 0 0;
    color: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
        .stepNodeAlert.alertContentColor};
    font-size: ${({ theme }) =>
      theme.sqleTheme.workflowTemplate.updateWorkflowTemplateStepInfo
        .infoFontSize};
    line-height: 20px;

    .step-alert-item-icon {
      list-style-type: disc;
      margin-bottom: 0;
    }
  }
`;
