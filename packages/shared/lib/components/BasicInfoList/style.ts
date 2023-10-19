import { styled } from '@mui/material/styles';
import { Card } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const BasicInfoListStyleWrapper = styled(Card)`
  &.${ANTD_PREFIX_STR}-card.${ANTD_PREFIX_STR}-card-bordered {
    border-radius: ${({ theme }) =>
      theme.sharedTheme.components.basicInfoList.borderRadius};
    .${ANTD_PREFIX_STR}-card-body
      .${ANTD_PREFIX_STR}-card-grid.info-item-wrapper {
      padding: 0;
      display: flex;
      box-shadow: ${({ theme }) =>
        theme.sharedTheme.components.basicInfoList.bodyBoxShadow};

      .info-item-row {
        width: 100%;
        line-height: 40px;
      }

      .info-item-title {
        width: 150px;
        padding: 0 12px;
        border: ${({ theme }) =>
          theme.sharedTheme.components.basicInfoList.title.border};
        background-color: ${({ theme }) =>
          theme.sharedTheme.components.basicInfoList.title.backgroundColor};
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicInfoList.title.color};
        font-size: ${({ theme }) =>
          theme.sharedTheme.components.basicInfoList.title.fontSize};
        font-weight: ${({ theme }) =>
          theme.sharedTheme.components.basicInfoList.title.fontWeight};
      }

      .info-item-value {
        width: calc(100% - 150px);
        padding: 0 12px;
        border: ${({ theme }) =>
          theme.sharedTheme.components.basicInfoList.value.border};
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicInfoList.value.color};
        font-size: ${({ theme }) =>
          theme.sharedTheme.components.basicInfoList.value.fontSize};
        font-weight: ${({ theme }) =>
          theme.sharedTheme.components.basicInfoList.value.fontWeight};
        word-break: break-all;
      }
    }
  }
`;
