import { styled } from '@mui/material/styles';

export const ExecutionDataStyleWrapper = styled('div')`
  .execution-data-header {
    margin-bottom: 16px;
  }

  /* 执行数据卡片不显示 title 区域 */
  .card-header {
    display: none !important;
  }

  .card-cont {
    padding-top: 0 !important;
  }

  .execution-module-tag-content {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    svg {
      width: 12px;
      height: 12px;
    }
  }

  .execution-value-dimension-wrapper {
    display: inline-block;
    min-width: 120px;
  }

  .execution-process-status-wrapper {
    display: inline-block;
    min-width: 120px;
  }

  .execution-process-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .execution-process-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .ant-table-wrapper.actiontech-table-namespace {
    padding-bottom: 0 !important;
  }
`;
