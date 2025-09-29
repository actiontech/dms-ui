import { FormStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';
import { styled } from '@mui/material/styles';

export const VersionDetailStyleWrapper = styled('section')`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .flow-wrapper {
    width: 100%;
    flex: 1;

    .ant-spin-container {
      width: 100%;
      height: 100%;
    }
  }

  .react-flow__node {
    width: 400px;
    font-size: 12px;
  }

  .react-flow__node-stageNode,
  .react-flow__node-input,
  .react-flow__node-default,
  .react-flow__node-output {
    background: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorBgLayout} !important;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary} !important;
    border-radius: 5px;
    text-align: center;

    &:hover {
      background: ${({ theme }) =>
        theme.sharedTheme.basic.colorPrimaryBgActive} !important;
    }
  }

  .react-flow__node-stageNode {
    padding: 10px;

    .bottom-action-wrap {
      display: flex;

      .ant-space-item {
        flex: 1;

        button {
          width: 100%;
        }
      }
    }
  }

  .react-flow__attribution {
    display: none;
  }
`;

export const StageNodeStyleWrapper = styled('section')`
  overflow: hidden;

  .ant-space {
    width: 100%;
  }

  & .ant-card {
    height: 120px;
  }

  & .ant-card.empty-card {
    border: 2px dashed ${({ theme }) => theme.sharedTheme.uiToken.colorBorder};
  }

  & .ant-card .ant-card-body {
    padding: 12px !important;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .card-header {
      display: flex;

      .ant-space-item:first-of-type {
        flex: 1;
        overflow: hidden;
        text-align: start;
      }

      .ant-tag {
        margin: 0;
      }
    }

    .card-action-wrap {
      justify-content: flex-end;
    }

    .card-content-item {
      display: flex;

      .ant-space-item:last-of-type {
        flex: 1;
        overflow: hidden;
        text-align: start;
      }
    }
  }
`;

export const CustomActionNodeStyleWrapper = styled('section')`
  display: flex;
  justify-content: flex-end;
`;

export const ReleaseDrawerFormStyleWrapper = styled(FormStyleWrapper)`
  .data-source-item-wrapper {
    margin-bottom: 0 !important;
    padding-left: 20px !important;
  }

  .data-source-item {
    margin-bottom: 12px !important;

    .ant-form-item-label {
      display: none !important;
    }
  }

  .form-item-label-mb-16 {
    margin-bottom: 16px !important;
  }

  .data-source-row-select {
    width: 280px !important;
  }

  .data-source-row-divider {
    height: 36px !important;
    margin: 0 !important;
  }

  .data-source-row-rule-template {
    height: 36px !important;
    width: 36px !important;
  }

  .workflow-name-wrapper {
    .ant-space-item:first-of-type {
      display: flex;
    }

    a {
      font-weight: bold;
    }
  }
`;

export const CustomEdgeStyleWrapper = styled('section')<{
  labelX: number;
  labelY: number;
}>`
  position: absolute;
  transform: translate(-50%, -50%)
    translate(
      ${({ labelX }) => `${labelX}px`},
      ${({ labelY }) => `${labelY}px`}
    );
  font-size: 12px;
  pointer-events: all;
`;
