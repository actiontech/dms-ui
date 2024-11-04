import InternalSQLRenderer from './SQLRenderer';
import ViewOnlyEditor from './component/ViewOnlyEditor';
import Snippet from './component/Snippet';
import DiffViewOnlyEditor from './component/DiffViewOnlyEditor';
import {
  SQLRendererProps,
  SQLSnippetRendererProps,
  SQLViewOnlyEditorRendererProps,
  SQLDiffViewOnlyEditorRendererProps
} from './index.type';

type CompoundedComponent = React.ForwardRefExoticComponent<SQLRendererProps> & {
  Snippet: typeof Snippet;
  ViewOnlyEditor: typeof ViewOnlyEditor;
  DiffViewOnlyEditor: typeof DiffViewOnlyEditor;
};

export type {
  SQLRendererProps,
  SQLSnippetRendererProps,
  SQLViewOnlyEditorRendererProps,
  SQLDiffViewOnlyEditorRendererProps
};

const SQLRenderer = InternalSQLRenderer as CompoundedComponent;

SQLRenderer.Snippet = Snippet;
SQLRenderer.ViewOnlyEditor = ViewOnlyEditor;
SQLRenderer.DiffViewOnlyEditor = DiffViewOnlyEditor;

export default SQLRenderer;
