import { WorkflowRecordStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { styled } from '@mui/material/styles';

export const BasicInfoStyleWrapper = styled('div')<{
  gap: number;
  status?: WorkflowRecordStatusEnum;
}>`
  display: flex;
  padding: 24px 40px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillQuaternary};

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

    .icon-order-status-wrapper {
      position: absolute;
      z-index: 9;
      color: ${({ theme, status }) =>
        status
          ? theme.baseTheme.dataExport.statistics.auditResultStatusColor[status]
          : theme.baseTheme.dataExport.statistics.auditResultStatusColor
              .wait_for_approve};
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
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 24px;
    font-weight: 500;
    line-height: 32px;
    margin-bottom: ${({ gap }) => `${gap}px`};
  }

  .workflow-base-info-desc {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
  }
`;
