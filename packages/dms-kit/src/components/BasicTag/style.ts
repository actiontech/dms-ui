import { styled } from '@mui/material/styles';
import { Tag } from 'antd';
import { BasicTagColor } from '../../theme/theme.type';

export const BasicTagStyleWrapper = styled(Tag)<{ color: BasicTagColor }>`
  &.basic-tag-wrapper.ant-tag {
    display: flex;
    height: 28px;
    padding: 0 8px 0 6px;
    align-items: center;
    border-radius: 4px;
    width: max-content;

    svg:first-of-type {
      margin-right: 6px;
    }

    span:first-of-type {
      margin-right: 6px;
    }

    .ant-tag-close-icon {
      margin-left: 6px;
      margin-right: 2px !important;
    }

    &.basic-large-tag-wrapper,
    &.basic-default-tag-wrapper {
      font-size: 13px !important;
    }

    color: ${({ color, theme }) =>
      theme.sharedTheme.components.basicTag[color].color} !important;
    background: ${({ color, theme }) =>
      theme.sharedTheme.components.basicTag[color].backgroundColor} !important;
  }

  &.basic-tag-wrapper.basic-small-tag-wrapper.ant-tag {
    height: 22px;
    line-height: 22px;
    padding: 0 6px;
    font-size: 12px !important;
  }

  &.basic-tag-wrapper.basic-large-tag-wrapper.ant-tag {
    height: 32px;
    line-height: 32px;
    padding: 0 8px;
  }

  &.basic-tag-wrapper.ant-tag:not(.ant-tag-borderless) {
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  }
`;
