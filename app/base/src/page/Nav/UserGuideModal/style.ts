import { styled } from '@mui/material/styles';

export const UserGuideModalStyleWrapper = styled('div')`
  margin-bottom: 32px;

  & .ant-radio-group.radio-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .radio-option {
      display: flex;
      align-items: flex-start;
      width: 100%;
      padding: 16px;
      margin: 0;
      border: 1px solid ${({ theme }) => theme.sharedTheme.uiToken.colorBorder};
      border-radius: 8px;
      background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};

      &:hover {
        border-color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      }

      &.ant-radio-wrapper-checked {
        border-color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        background: ${({ theme }) =>
          theme.sharedTheme.basic.colorPrimaryBgActive};
      }

      .ant-radio {
        margin-top: 2px;
      }

      .ant-radio + span {
        margin-left: 12px;
        flex: 1;
      }
    }
  }

  .option-content {
    width: 100%;
  }

  .option-label {
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
    margin-bottom: 4px;
  }

  .option-description {
    font-size: 12px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    line-height: 1.4;
  }
`;

export const UserGuideModalButtonContainer = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;
