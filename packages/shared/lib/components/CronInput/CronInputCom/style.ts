import { styled } from '@mui/material/styles';
import { ANTD_PREFIX_STR } from '../../../data/common';

export const CronSelectStyleWrapper = styled('section')`
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  border-radius: 8px;
  padding: 20px;
  margin-top: 16px;

  &.error-style {
    border-color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
  }

  .header {
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
  }

  .week-wrapper {
    margin-top: 12px;

    .${ANTD_PREFIX_STR}-col:nth-of-type(1) {
      border-right: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    }
  }

  .hour-minute-wrapper {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;

    .hour-wrapper {
      width: 244px;
    }

    .minute-wrapper {
      width: 408px;
    }

    .btn-wrapper {
      display: flex;
      flex-wrap: wrap;
    }

    .sub-title {
      font-size: 12px;
      font-weight: 500;
      line-height: 20px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      margin-top: 8px;
    }

    .number-btn.${ANTD_PREFIX_STR}-btn {
      text-align: center !important;
      line-height: 28px !important;
      width: 28px;
      height: 28px;
      margin-right: 6px;
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 600;
    }
  }
`;
