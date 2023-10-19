import { styled } from '@mui/material/styles';
import { ANTD_PREFIX_STR } from '../../data/common';

export const BasicResultStyleWrapper = styled('section')`
  &.basic-result-wrapper {
    display: flex;
    width: 100%;
    height: calc(100vh - 60px);
    justify-content: center;
    align-items: center;

    .${ANTD_PREFIX_STR}-result {
      padding: 0;

      .${ANTD_PREFIX_STR}-result-icon {
        margin-bottom: 0;
      }

      .${ANTD_PREFIX_STR}-result-title {
        margin: 16px 0;
        line-height: 32px;
        font-weight: 500;
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicResult.title.color};
      }

      .${ANTD_PREFIX_STR}-result-subTitle {
        max-width: 560px;
        line-height: 22px;
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicResult.subTitle.color};
      }

      .${ANTD_PREFIX_STR}-result-extra {
        margin-top: 32px;

        > * {
          margin-right: 12px;
        }
      }
    }
  }
`;
