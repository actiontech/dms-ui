import { styled } from '@mui/material/styles';

export const SqlAnalyzeContStyleWrapper = styled('section')`
  padding-top: 60px;

  .tab-wrapper {
    padding: 14px 40px;
    box-sizing: content-box;
    display: flex;
    align-items: center;
    height: 28px;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
  }
`;

export const SqlContStyleWrapper = styled('section')`
  .header-title {
    margin-bottom: 0;
    padding: 24px 40px 12px;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    border-bottom: 2px solid
      ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
  }

  .basic-cont-wrapper {
    min-height: 100px;
  }

  .sql-cont {
    padding: 24px 40px;

    pre {
      width: 100%;
      white-space: pre-wrap;
    }
  }

  .line-wrapper {
    margin-top: 24px;
    margin-left: 40px;
    padding: 24px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    border-radius: 8px;
    width: 560px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3,
    p {
      margin-bottom: 0;
    }

    .line-left {
      display: flex;
      align-items: center;
    }

    .icon-line {
      width: 36px;
      height: 36px;
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillSecondary};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
    }

    .line-text {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      line-height: 20px;
      font-size: 13px;
      font-weight: 400;
    }

    .number-cont {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      font-size: 20px;
      font-weight: 700;
      line-height: 28px;
    }
  }
`;
