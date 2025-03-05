import { cloneDeep, isObject } from 'lodash';

const mockEditor = (props) => {
  const { onMount, onChange, value, commands, ...otherProps } = props;

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
