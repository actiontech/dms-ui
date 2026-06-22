import { styled } from '@mui/material/styles';

const hexToRgba = (hexColor: string, alpha: number) => {
  if (!/^#([0-9a-fA-F]{6})$/.test(hexColor)) {
    return `rgba(140, 140, 140, ${alpha})`;
  }

  const red = parseInt(hexColor.slice(1, 3), 16);
  const green = parseInt(hexColor.slice(3, 5), 16);
  const blue = parseInt(hexColor.slice(5, 7), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

export const EnvironmentTagStyleWrapper = styled('span')<{
  color: string;
  size: 'small' | 'default';
  ellipsis?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  width: max-content;
  max-width: ${({ ellipsis = true }) => (ellipsis ? '100%' : 'none')};
  height: ${({ size }) => (size === 'small' ? '22px' : '24px')};
  padding: ${({ size }) => (size === 'small' ? '0 6px' : '0 8px')};
  border-radius: 4px;
  color: ${({ color }) => color};
  background: ${({ color }) => hexToRgba(color, 0.1)};
  border: 1px solid ${({ color }) => hexToRgba(color, 0.32)};
  font-size: 12px;
  line-height: 1;
  vertical-align: middle;
  flex-shrink: 0;

  .environment-tag-name {
    overflow: ${({ ellipsis = true }) => (ellipsis ? 'hidden' : 'visible')};
    text-overflow: ${({ ellipsis = true }) => (ellipsis ? 'ellipsis' : 'unset')};
    white-space: nowrap;
  }
`;
