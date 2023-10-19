import { ParagraphProps } from 'antd5/es/typography/Paragraph';

type EditTextEditableProps = Omit<
  Exclude<Required<ParagraphProps>['editable'], boolean>,
  'onEnd'
> & {
  onEnd?: (value: string) => void;
};

export interface EditTextProps extends Omit<ParagraphProps, 'editable'> {
  editable?: EditTextEditableProps;
}
