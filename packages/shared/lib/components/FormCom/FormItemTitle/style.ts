import { styled } from '@mui/material/styles';
import { Typography } from 'antd';

export const FormItemBigTitleStyleWrapper = styled(Typography.Title)`
  &.ant-typography {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 48px;
    margin-bottom: 0 !important;
  }

  .title-icon {
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    border-radius: 6px;
    padding: 3px 4px;
    margin-right: 16px;

    svg {
      width: 32px;
      height: 32px;
    }

    .custom-icon {
      display: flex;
      align-items: center;
    }
  }
`;

export const FormItemSubTitleStyleWrapper = styled(Typography.Title)`
  &.ant-typography {
    font-size: 18px !important;
    margin-bottom: 0 !important;
    height: 58px !important;
    line-height: 58px !important;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: -10px;
      top: 50%;
      margin-top: -10px;
      display: inline-block;
      width: 4px;
      height: 20px;
      border-radius: 1px;
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }
  }
`;
