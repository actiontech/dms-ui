import { styled } from '@mui/material/styles';

export const ChartContTitleStyleWrapper = styled('section')<{
  clearMainTextMargin: boolean;
}>`
  height: auto;
  display: flex;
  align-items: center;

  .line-block {
    height: 48px;
    width: 4px;
    margin: 4px 0;
    border-radius: 4px;
    margin-right: 16px;
  }

  .line-cont {
    .sub-cont {
      display: inline-block;
      margin-left: ${({ clearMainTextMargin }) =>
        clearMainTextMargin ? 0 : '0.5em'};
    }

    .line1-main {
      font-size: 24px;
      font-weight: 700;
      line-height: 32px;
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.ChartContTitle.mainColor};

      .sub-cont {
        color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.ChartContTitle.mainSubColor};
      }
    }

    .line1-main-sub {
      font-size: 12px;
      font-weight: 500;
      margin-top: 4px;
      line-height: 20px;
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.ChartContTitle.subContColor};
    }
  }
`;
