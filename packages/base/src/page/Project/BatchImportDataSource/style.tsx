import { styled } from '@mui/material/styles';

export const ConnectableInfoModalWrapper = styled('div')`
  max-height: 500px;
  overflow-y: auto;
`;

export const BatchImportCheckResultStyleWrapper = styled('div')`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .batch-import-check-column {
    padding: 12px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .column-title {
    font-weight: 600;
  }

  .column-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;
