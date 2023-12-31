import { styled } from '@mui/material/styles';
import { Card } from 'antd';

export const CardWrapperStyleWrapper = styled(Card)`
  height: 100%;

  > div {
    padding-top: 0 !important;
    height: 100%;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid
      ${({ theme }) =>
        theme.sqleTheme.reportStatistics.CardWrapper.titleBorderColor};

    .title {
      display: flex;
      align-items: center;

      .title-cont {
        font-size: 14px;
        color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.CardWrapper.titleColor};
      }

      .icon-tip {
        font-size: 16px;
        cursor: pointer;
        margin-left: 4px;
      }
    }

    .extra {
      padding-left: 1em;
      cursor: pointer;
    }
  }

  .card-cont {
    padding-top: 20px;
    height: calc(100% - 40px);
  }
`;
