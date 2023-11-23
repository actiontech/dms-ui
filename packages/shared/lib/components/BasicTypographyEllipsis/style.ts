import { styled } from '@mui/material/styles';
import { Typography } from 'antd';

export const TypographyStyleWrapper = styled(Typography.Paragraph)`
  max-width: 100%;

  &.ant-typography.ant-typography-ellipsis {
    margin-bottom: 0;
    display: flex;
    align-items: center;

    span:not(.anticon-copy):first-of-type {
      display: inline-flex;
      overflow: hidden;
      word-break: keep-all;
    }

    .ant-typography-copy {
      height: 18px;
      width: 18px;
      opacity: 0;
      border-radius: 4px;
      margin-inline-start: 10px;

      &:hover {
        opacity: 1;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        background-color: ${({ theme }) =>
          theme.sharedTheme.basic.colorPrimaryBgHover} !important;
      }
    }

    &:hover {
      .ant-typography-copy {
        opacity: 1;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      }
    }
  }
`;
