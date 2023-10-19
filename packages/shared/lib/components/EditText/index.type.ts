import { ButtonProps } from 'antd5';
import { ParagraphProps } from 'antd5/es/typography/Paragraph';

export type EditTypeProps = {
  value: string;
  editable?: Omit<
    Exclude<Required<ParagraphProps>['editable'], boolean>,
    'onEnd'
  > & {
    onEnd?: (value: string) => void;
  };
  editButtonProps?: Omit<ButtonProps, 'onClick'>;
} & Omit<ParagraphProps, 'editable'>;
