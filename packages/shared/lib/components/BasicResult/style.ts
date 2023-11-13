import { styled } from '@mui/material/styles';

export const BasicResultStyleWrapper = styled('section')`
  &.basic-result-wrapper {
    display: flex;
    width: 100%;
    height: calc(100vh - 60px);
    justify-content: center;
    align-items: center;

    .ant-result {
      padding: 0;

      .ant-result-icon {
        margin-bottom: 0;
      }

      .ant-result-title {
        margin: 16px 0;
        line-height: 32px;
        font-weight: 500;
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicResult.title.color};
      }

      .ant-result-subTitle {
        max-width: 560px;
        line-height: 22px;
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicResult.subTitle.color};
      }

      .ant-result-extra {
        margin-top: 32px;

        > * {
          margin-right: 12px;
        }
      }
    }
  }
`;
