import { styled } from '@mui/material/styles';
import { Tag } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';
import { BasicTagColor } from '../../theme/theme.type';

//todo small and large
export const BasicTagStyleWrapper = styled(Tag)<{ color: BasicTagColor }>`
  &.basic-tag-wrapper.${ANTD_PREFIX_STR}-tag {
    display: flex;
    height: 28px;
    padding: 0 8px 0 6px;
    align-items: center;
    border-radius: 4px;

    span:first-of-type {
      margin-right: 6px;
    }
  }

  &.basic-tag-wrapper.basic-small-tag-wrapper.${ANTD_PREFIX_STR}-tag {
    height: 22px;
    line-height: 22px;
    padding: 0 6px;
  }

  &.basic-tag-wrapper.basic-large-tag-wrapper.${ANTD_PREFIX_STR}-tag {
    height: 32px;
    line-height: 32px;
    padding: 0 8px;
  }

  &.basic-tag-wrapper.${ANTD_PREFIX_STR}-tag:not(.${ANTD_PREFIX_STR}-tag-borderless) {
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    background: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
  }

  // todo: color 属性若与当前 antd tag color 定义颜色重复，需要覆盖颜色 -> color: gray
  &.basic-tag-wrapper.${ANTD_PREFIX_STR}-tag:not(.basic-default-tag-wrapper) {
    color: ${({ color, theme }) =>
      theme.sharedTheme.components.basicTag[color].color} !important;
    background: ${({ color, theme }) =>
      theme.sharedTheme.components.basicTag[color].backgroundColor} !important;
  }
`;
