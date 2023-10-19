import { styled } from '@mui/material/styles';
import { Card } from 'antd5';

export const CardShowStyleWrapper = styled(Card)`
  height: 100%;

  > div {
    height: 100%;
    position: relative;
  }

  .card-title {
    height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) =>
      theme.sqleTheme.reportStatistics.cardShow.titleColor};

    .title-cont {
      font-style: none;
      font-size: 14px;
      line-height: 24px;
    }
  }

  .card-cont {
    position: absolute;
    bottom: 20px;

    .note-cont {
      font-size: 12px;
      line-height: 30px;
      height: 30px;
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.cardShow.noteColor};

      .note-wrapper {
        display: flex;
        align-items: center;

        > span:first-of-type {
          margin-right: 1.2em;
        }

        .value {
          padding-left: 0.2em;
        }
      }
    }

    .number-cont {
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.cardShow.numberContColor};
      font-size: ${({ theme }) =>
        `${theme.sqleTheme.reportStatistics.cardShow.contentFontSize}px`};
      font-weight: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.cardShow.contentFontWeight};
    }
  }
`;
