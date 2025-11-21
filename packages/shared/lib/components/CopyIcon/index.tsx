export interface CopyIconProps {
  text?: string;
  onCopyComplete?: (event?: React.MouseEvent<HTMLDivElement>) => void;
  onCopy?: (event?: React.MouseEvent<HTMLDivElement>) => void;
  tooltips?: boolean | React.ReactNode;
  format?: 'text/plain' | 'text/html';
  children?: React.ReactNode;
  className?: string;
  onCustomCopy?: (event?: React.MouseEvent<HTMLDivElement>) => void;
}

export { default } from './CopyIcon';
