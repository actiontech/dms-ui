import InternalSQLRenderer from './SQLRenderer';
import ViewOnlyEditor from './component/ViewOnlyEditor';
import Snippet from './component/Snippet';
import {
  SQLRendererProps,
  SQLSnippetRendererProps,
  SQLViewOnlyEditorRendererProps
} from './index.type';

type CompoundedComponent = React.ForwardRefExoticComponent<SQLRendererProps> & {
  Snippet: typeof Snippet;
  ViewOnlyEditor: typeof ViewOnlyEditor;
};

export type {
  SQLRendererProps,
  SQLSnippetRendererProps,
  SQLViewOnlyEditorRendererProps
};

const SQLRenderer = InternalSQLRenderer as CompoundedComponent;

SQLRenderer.Snippet = Snippet;
SQLRenderer.ViewOnlyEditor = ViewOnlyEditor;

export default SQLRenderer;
