import { styled } from '@mui/material/styles';
import { Tooltip } from 'antd';

export const PopoverInnerContentStyleWrapper = styled('div')<{
  width?: number;
}>`
  max-width: 640px;
  width: ${({ width }) => (width ? `${width}px` : 'auto')};
  max-height: 320px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  border-radius: 6px;
  padding: 8px 12px;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
  font-size: 14px;
  font-weight: 500;
`;

export const ToolTipStyleWrapper = styled(Tooltip)`
  .tooltips-default-icon {
    font-size: 14px;
    cursor: pointer;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorWarning};
  }

  .ant-space-item {
    display: inline-flex;
    align-items: center;
  }
`;
