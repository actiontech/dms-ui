import { styled } from '@mui/material/styles';
import { Space, Card } from 'antd';
import { BasicTagColor } from '../../theme/theme.type';

export const CEIndexStyleWrapper = styled('section')`
  background: ${({ theme }) => theme.sharedTheme.basic.colorBgLayoutGray};

  .common-mode-wrapper {
    .ant-col {
      padding: 40px;
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
        opacity: 0.06;
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

  .config-mode-wrapper.none-padding-top {
    padding-top: 0;
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

    .version-subTitle-wrap {
      display: inline-block;
      height: 44px;
      text-align: center;
    }

    .version-desc-wrap {
      width: auto;
    }
  }
`;

export const VersionComparisonStyleWrapper = styled(Space)`
  .content-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .ant-card {
      width: 32%;
    }
  }
`;

export const VersionComparisonItemCardStyleWrapper = styled(Card)<{
  color: BasicTagColor;
}>`
  &.ant-card.ant-card-bordered {
    border: 2px solid
      ${({ theme, color }) =>
        theme.sharedTheme.components.basicTag[color].color};

    &:hover {
      border: 2px solid
        ${({ theme, color }) =>
          theme.sharedTheme.components.basicTag[color].color};
    }
  }

  &.ant-card.ant-card-hoverable .ant-card-body {
    padding: 24px 16px;
  }

  &.ant-card.ant-card-hoverable {
    border-radius: 20px;
  }

  .version-tag-wrap {
    margin-bottom: 20px;
  }

  .version-item {
    width: 100%;

    & > .ant-space-item {
      width: 100%;
      display: flex;
      justify-content: center;

      .ant-divider {
        margin: 0;
      }

      &:last-child {
        padding: 0 12px;
      }
    }

    .apply-button {
      width: 50%;
    }
  }

  .term-wrap {
    display: inline-block;
    height: 22px;
  }

  & .content-list {
    width: 216px;
  }

  & .content-list .ant-space-item {
    width: auto;
  }
`;
