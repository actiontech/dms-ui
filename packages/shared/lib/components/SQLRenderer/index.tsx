import InternalSQLRenderer from './SQLRenderer';
import EditorView from './component/EditorView';
import Snippet from './component/Snippet';
import {
  SQLRendererProps,
  SQLSnippetRendererProps,
  SQLEditorViewRendererProps
} from './index.type';

type CompoundedComponent = React.ForwardRefExoticComponent<SQLRendererProps> & {
  Snippet: typeof Snippet;
  EditorView: typeof EditorView;
};

export type {
  SQLRendererProps,
  SQLSnippetRendererProps,
  SQLEditorViewRendererProps
};

const SQLRenderer = InternalSQLRenderer as CompoundedComponent;

SQLRenderer.Snippet = Snippet;
SQLRenderer.EditorView = EditorView;

export default SQLRenderer;
