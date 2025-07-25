import { cloneDeep, isObject } from 'lodash';

const mockEditor = (props) => {
  const { onChange, value, commands, onMount, ...otherProps } = props;

  if (onMount) {
    const editor = {
      getContentHeight: () => 1000,
      getContentWidth: () => 800,
      getLayoutInfo: () => ({ height: 500, width: 600 }),
      getScrollTop: () => 0,
      getScrollLeft: () => 0,
      setScrollTop: () => undefined,
      setScrollLeft: () => undefined,
      onDidChangeModelContent: () => undefined,
      onDidLayoutChange: () => undefined,
      onDidFocusEditorText: () => undefined,
      onDidBlurEditorText: () => undefined
    };
    onMount(
      {
        ...editor,
        getModifiedEditor: () => editor
      },
      {
        editor: {
          defineTheme: () => undefined,
          setTheme: () => undefined
        },
        languages: {
          registerCompletionItemProvider: () => undefined,
          register: () => undefined,
          setMonarchTokensProvider: () => undefined
        }
      }
    );
  }

  const cloneProps = cloneDeep(otherProps);

  Object.keys(cloneProps).forEach((key) => {
    if (isObject(cloneProps[key])) {
      cloneProps[key] = JSON.stringify(cloneProps[key]);
    }
  });

  // @uiw/react-md-editor commands
  if (commands) {
    return (
      <div>
        <input
          onChange={(e) => onChange(e.target.value)}
          value={value ?? ''}
          {...cloneProps}
        />
        {commands.map((command) => {
          return (
            <button
              key={command.keyCommand}
              {...command.buttonProps}
              onClick={() =>
                command.execute(null, {
                  replaceSelection: (v) => onChange?.(v)
                })
              }
            >
              {command.name}
              {command.icon}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <input
      onChange={(e) => onChange(e.target.value)}
      value={value ?? ''}
      {...cloneProps}
    />
  );
};

export const DiffEditor = mockEditor;

mockEditor.Markdown = (props) => {
  const { source, ...otherProps } = props;
  return <div {...otherProps}>{source}</div>;
};

export const loader = {
  config: jest.fn(),
  init: jest.fn(() => Promise.resolve())
};

export const commands = {
  getCommands: () => []
};

export default mockEditor;
