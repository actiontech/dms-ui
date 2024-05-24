import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { styled } from '@mui/material/styles';

export const BasicInfoStyleWrapper = styled('div')<{
  gap: number;
  status?: WorkflowRecordResV2StatusEnum;
}>`
  display: flex;
  padding: 24px 40px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-bottom: 1px solid
    ${({ theme }) => theme.sqleTheme.execWorkflow.common.basicInfo.borderColor};
  background: ${({ theme }) =>
    theme.sqleTheme.execWorkflow.common.basicInfo.bgColor};

  &.hasTopHeader {
    padding-top: 60px;
  }

  &.clearPaddingTop {
    padding-top: 0;
  }

  .workflow-base-info-status {
    position: relative;
    display: flex;
    height: 48px;
    width: 64px;
    justify-content: center;
    margin-bottom: 20px;

    .icon-workflow-status-wrapper {
      position: absolute;
      z-index: 9;
      color: ${({ theme, status }) =>
        status
          ? theme.sqleTheme.statistics.auditResultStatusColor[status]
          : theme.sqleTheme.statistics.auditResultStatusColor.wait_for_audit};
    }

    &-text {
      margin-top: 10px;
      z-index: 10;
      color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      line-height: 20px;
    }
  }

  .workflow-base-info-title {
    color: ${({ theme }) =>
      theme.sqleTheme.execWorkflow.common.basicInfo.titleColor};
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
    margin-bottom: ${({ gap }) => `${gap}px`};
  }

  .workflow-base-info-desc {
    color: ${({ theme }) =>
      theme.sqleTheme.execWorkflow.common.basicInfo.descColor};
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
  }
`;
