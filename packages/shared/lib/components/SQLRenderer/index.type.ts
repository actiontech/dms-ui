import { EditorProps } from '@monaco-editor/react';
import { TooltipProps } from 'antd';
import { ParagraphProps } from 'antd/es/typography/Paragraph';
import { MouseEventHandler } from 'react';

export type SQLRendererProps = {
  /**
   * 是否显示行号
   *
   * default value: false
   */
  showLineNumbers?: boolean;

  /**
   * 是否保留原始SQL的完整格式
   *
   * default value: true
   */
  preserveOriginalFormat?: boolean;

  /**
   * 是否高亮 SQL
   *
   * default value: true
   */
  highlightSyntax?: boolean;

  className?: string;

  /**
   * click handle
   */
  onClick?: MouseEventHandler<HTMLDivElement>;

  /**
   * 需要渲染的 SQL 语句
   * 当为空时，默认使用 - 进行占位
   */
  sql?: string;

  /**
   * 当 sql 为空时的默认占位符
   * default value: -
   */
  emptySqlContent?: string | React.ReactNode;

  /**
   * todo
   * 定义 SQL 语句的最大高度，超出部分将滚动显示
   * 默认使用 px 作为单位
   * default value: none (auto-resize based on content)
   */
  // maxHeight?: string | number;

  /**
   * 是否显示复制SQL语句的图标
   * default value: true
   */
  showCopyIcon?: boolean | 'always' | 'hover';

  /**
   * 复制操作完成后的回调函数
   */
  onCopyComplete?: () => void;

  /**
   * 复制图标的自定义类名，用于添加额外的样式
   */
  copyIconClassName?: string;

  /**
   * todo
   * 异步函数，用于从远程源获取 SQL 语句
   */
  // fetchSql?: () => Promise<string>;

  /**
   * 手动设置为加载状态
   * default value: false
   */
  loading?: boolean;
};

export type SQLSnippetRendererProps = Omit<
  SQLRendererProps,
  'showLineNumbers' | 'preserveOriginalFormat'
> & {
  /**
   * 展示的 SQL 切片的行数
   * default value: 10
   */
  rows?: number;

  /**
   * 继承 antd 的 Tooltip
   */
  tooltip?: React.ReactNode | TooltipProps;

  /**
   * 继承 antd 的 paragraph
   */
  paragraph?: ParagraphProps;
};

export type SQLViewOnlyEditorRendererProps = {
  sql?: string;
} & Omit<EditorProps, 'theme' | 'language'>;
