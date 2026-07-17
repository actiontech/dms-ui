import { styled } from '@mui/material/styles';

export const SqlManagementListStyleWrapper = styled('section')`
  /* 动态列 / 动态筛选项共用：蓝色 * 标记 */
  .sql-manage-source-extra-mark {
    position: relative;
    display: inline-block;
    padding-right: 0.55em;

    &::after {
      content: '*';
      position: absolute;
      top: 0.2em;
      right: 0;
      font-size: 12px;
      line-height: 1;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }
  }
`;
