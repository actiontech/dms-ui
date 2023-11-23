import { styled } from '@mui/material/styles';

export const DefaultSceneSegmentedWrapper = styled('section')`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `0 ${theme.baseTheme.guidance.padding}px`};
  height: 56px;
  background-color: ${({ theme }) =>
    theme.baseTheme.guidance.sceneSegmented.backgroundColor};
  border-bottom: ${({ theme }) =>
    theme.baseTheme.guidance.sceneSegmented.borderBottom};
`;

export const DefaultSceneStepContainerWrapper = styled('section')`
  padding: ${({ theme }) => theme.baseTheme.guidance.padding}px;

  .step-container {
    position: relative;
  }

  .step-container:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.baseTheme.guidance.gap}px;

    ::after {
      content: '';
      position: absolute;
      top: calc(
        50% +
          ${({ theme }) =>
            theme.baseTheme.guidance.steps.icon.height / 2 +
            theme.baseTheme.guidance.steps.connection.gap}px
      );
      left: ${({ theme }) =>
        (theme.baseTheme.guidance.steps.icon.width -
          theme.baseTheme.guidance.steps.connection.width) /
        2}px;
      width: ${({ theme }) =>
        theme.baseTheme.guidance.steps.connection.width}px;
      height: calc(50% + ${({ theme }) => theme.baseTheme.guidance.gap / 2}px);
      background-color: ${({ theme }) =>
        theme.baseTheme.guidance.steps.connection.backgroundColor};
    }
  }

  .step-container:not(:first-of-type) {
    ::before {
      content: '';
      position: absolute;
      top: ${({ theme }) => -theme.baseTheme.guidance.steps.icon.height}px;
      left: ${({ theme }) =>
        (theme.baseTheme.guidance.steps.icon.width -
          theme.baseTheme.guidance.steps.connection.width) /
        2}px;
      width: ${({ theme }) =>
        theme.baseTheme.guidance.steps.connection.width}px;
      height: calc(50% + ${({ theme }) => theme.baseTheme.guidance.gap / 2}px);
      background-color: ${({ theme }) =>
        theme.baseTheme.guidance.steps.connection.backgroundColor};
    }
  }

  .icon-wrapper {
    margin-right: 24px;

    .step-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: ${({ theme }) => theme.baseTheme.guidance.steps.icon.width}px;
      height: ${({ theme }) => theme.baseTheme.guidance.steps.icon.height}px;
      background-color: ${({ theme }) =>
        theme.baseTheme.guidance.steps.icon.backgroundColor};
      border-radius: 50%;
    }
  }

  .step-box {
    display: flex;
    padding: 16px 24px;
    border: ${({ theme }) => theme.baseTheme.guidance.steps.step.border};
    border-radius: 8px;

    .ant-row {
      flex: 1;
    }

    .title-wrapper {
      display: flex;
      align-items: center;
      box-sizing: content-box;
      width: 140px;
      padding: 16px 40px 16px 0;
      border-right: ${({ theme }) =>
        theme.baseTheme.guidance.steps.step.title.borderRight};

      .inner-title-wrapper {
        .step-index {
          width: 100%;
          line-height: 21px;
          color: ${({ theme }) =>
            theme.baseTheme.guidance.steps.step.title.index.color};
        }

        .step-title {
          width: 100%;
          line-height: 24px;
          font-size: 16px;
          font-weight: 500;
          color: ${({ theme }) =>
            theme.baseTheme.guidance.steps.step.title.text.color};
        }
      }
    }

    .content-wrapper {
      padding: 16px 0 16px 40px;

      .sub-title {
        font-weight: 500;
      }

      .desc {
        font-size: 13px;
        line-height: 20px;
        font-weight: 300;
        color: ${({ theme }) =>
          theme.baseTheme.guidance.steps.step.content.desc.color};
      }

      .actions {
        margin-top: 8px;
      }
    }
  }
`;
