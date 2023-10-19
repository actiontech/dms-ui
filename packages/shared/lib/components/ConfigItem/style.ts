import { styled } from '@mui/material/styles';
import { Row } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const ConfigItemStyledWrapper = styled(Row)`
  width: 100%;
  padding: 32px 0;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};

  .${ANTD_PREFIX_STR}-btn.config-item-filed-edit-button {
    width: 40px !important;
    height: 24px;
    border-radius: 100px;
    border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillSecondary};
  }

  .config-item-label {
    .title {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
      font-weight: 500;
      line-height: 22px;
    }

    .tips {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      line-height: 22px;
    }
  }

  .config-item-filed {
    display: flex;
    min-height: 36px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};

    .${ANTD_PREFIX_STR}-input-number-affix-wrapper
      .${ANTD_PREFIX_STR}-input-number-handler-wrap {
      display: none;
    }
  }

  .${ANTD_PREFIX_STR}-upload.${ANTD_PREFIX_STR}-upload-select {
    width: 120;
    height: 120;
    margin: 0;
    border-radius: 8px;

    .upload-content-wrapper {
      width: 100%;
      height: 100%;
      position: relative;

      img {
        width: 100%;
        height: 100%;
      }

      .mask {
        position: absolute;
        display: flex;
        top: 0;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: ${({ theme }) =>
          theme.sharedTheme.components.configItem.maskBg};
        color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
      }
    }
  }
`;
