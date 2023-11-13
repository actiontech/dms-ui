import { styled } from '@mui/material/styles';
import { Card } from 'antd';

export const BasicInfoListStyleWrapper = styled(Card)`
  &.ant-card.ant-card-bordered {
    border-radius: ${({ theme }) =>
      theme.sharedTheme.components.basicInfoList.borderRadius};
    .ant-card-body .ant-card-grid.info-item-wrapper {
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
