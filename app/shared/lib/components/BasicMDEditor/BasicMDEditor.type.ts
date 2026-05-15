import { MDEditorProps } from '@uiw/react-md-editor';
import { SupportTheme } from '@actiontech/dms-kit';

export interface BasicMDEditorProps extends MDEditorProps {
  customTheme?: SupportTheme;
}

// 从 MDEditorProps 的 previewOptions 中提取 MarkdownPreviewProps 类型
export type MarkdownPreviewProps = NonNullable<
  MDEditorProps['previewOptions']
> & {
  source?: string;
};

export interface BasicMDEditorMarkdownProps extends MarkdownPreviewProps {
  customTheme?: SupportTheme;
}
