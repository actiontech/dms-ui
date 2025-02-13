import { styled } from '@mui/material';

export const KnowledgeGraphStyleWrapper = styled('div')`
  width: 100%;
  height: calc(100% - 240px);
  padding: 12px;
  margin-top: 20px;
  border-radius: 10px;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

  background: linear-gradient(120deg, #fdfbfb 0%, #f9f7f7 100%),
    radial-gradient(circle at 50% 50%, #ffffff 0%, transparent 100%);
  background-blend-mode: soft-light;

  background-image: radial-gradient(#f0f0f0 1px, transparent 1px),
    radial-gradient(#f0f0f0 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;

  .sigma-container {
    height: 100%;
    width: 100%;
    background: transparent;
  }

  .sigma-container-full-screen {
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  }
`;
