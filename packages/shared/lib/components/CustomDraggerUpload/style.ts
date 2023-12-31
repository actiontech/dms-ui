import { styled } from '@mui/material/styles';
import { Upload } from 'antd';

export const CustomUploadDraggerStyleWrapper = styled(Upload.Dragger)<{
  hiddenContainer: boolean;
}>`
  &.ant-upload-wrapper {
    .ant-upload-drag {
      display: ${({ hiddenContainer }) => (hiddenContainer ? 'none' : 'block')};
      background: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary} !important;
    }

    border-radius: 8px;
    border: 1px dashed
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400px;
    background: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillTertiary} !important;

    .custom-icon {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
    }

    .title {
      margin-top: 10px;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
    }
  }
`;
