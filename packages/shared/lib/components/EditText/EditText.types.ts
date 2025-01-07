import { ButtonProps } from 'antd';
import { ParagraphProps } from 'antd/es/typography/Paragraph';

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
