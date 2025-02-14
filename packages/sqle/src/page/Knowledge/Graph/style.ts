import { styled } from '@mui/material';

export const KnowledgeGraphStyleWrapper = styled('div')`
  width: 100%;
  height: calc(100% - 124px);
  padding: 12px;
  margin-top: 20px;
  border-radius: 10px;
  border: 1px solid
    ${({ theme }) => theme.sqleTheme.knowledgeTheme.graph.wrapper.borderColor};
  background-blend-mode: soft-light;
  background-image: radial-gradient(
      ${({ theme }) => theme.sqleTheme.knowledgeTheme.graph.wrapper.dotColor}
        1px,
      ${({ theme }) =>
          theme.sqleTheme.knowledgeTheme.graph.wrapper.backgroundColor}
        1px
    ),
    radial-gradient(
      ${({ theme }) => theme.sqleTheme.knowledgeTheme.graph.wrapper.dotColor}
        1px,
      ${({ theme }) =>
          theme.sqleTheme.knowledgeTheme.graph.wrapper.backgroundColor}
        1px
    );
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;

  .ant-spin-nested-loading {
    width: 100%;
    height: 100%;

    .ant-spin-container {
      width: 100%;
      height: 100%;
    }
  }

  .sigma-container {
    height: 100%;
    width: 100%;
    background: transparent;
  }

  .sigma-container-full-screen {
    background: ${({ theme }) =>
      theme.sqleTheme.knowledgeTheme.graph.container.fullScreenBgColor};
  }

  .graph-control-container {
    border: 1px solid
      ${({ theme }) => theme.sqleTheme.knowledgeTheme.graph.control.borderColor};
  }
`;
