import { styled } from '@mui/material/styles';

export const CEIndexStyleWrapper = styled('section')`
  background: ${({ theme }) => theme.sharedTheme.basic.colorBgLayoutGray};

  .common-mode-wrapper {
    height: calc(100vh - 60px);

    .ant-col {
      padding: 40px;
      height: calc(100vh - 60px);
    }
  }

  .title {
    margin: 0;
    font-weight: 600;
    line-height: 24px;
  }

  .left {
    border-right: 0.5 solid
      ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};

    .paragraph.ant-typography {
      margin: 16px 0;
      font-size: 14px;
      color: ${({ theme }) => theme.sharedTheme.basic.colorDefaultIcon};
      line-height: 22px;
      word-wrap: break-word;
    }

    .ant-image {
      border-radius: 8px;
    }
  }

  .right {
    .ce-card-info {
      width: 360px;
      position: relative;
      margin-top: 16px;

      .ant-card-body {
        padding: 16px 24px 20px;
      }

      &:last-child {
        margin-top: 20px;
      }

      .bg-icon {
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
      }

      .info-cont-wrapper {
        .title {
          color: ${({ theme }) => theme.sharedTheme.basic.colorFontGrayByWhite};
          font-size: 12px;
          font-weight: 700;
          line-height: 19px;
        }

        .cont-tip {
          width: 240px;
          margin-top: 21px;
          font-size: 14px;
          font-weight: 500;
          line-height: 22px;
          word-wrap: break-word;
        }
      }
    }
  }

  .config-mode-wrapper {
    padding: 32px 0;

    > .title {
      height: 32px;
      line-height: 32px;
    }

    .left {
      margin-top: 12px;
    }
  }
`;
