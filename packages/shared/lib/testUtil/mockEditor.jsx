import { cloneDeep, isObject } from 'lodash';

const mockEditor = (props) => {
  const { onMount, onChange, value, ...otherProps } = props;

  const cloneProps = cloneDeep(otherProps);

  Object.keys(cloneProps).forEach((key) => {
    if (isObject(cloneProps[key])) {
      cloneProps[key] = JSON.stringify(cloneProps[key]);
    }
  });
  return (
    <input
      onChange={(e) => onChange(e.target.value)}
      value={value ?? ''}
      {...cloneProps}
    />
  );
};

mockEditor.Markdown = (props) => {
  const { source, ...otherProps } = props;
  return <div {...otherProps}>{source}</div>;
};

export const loader = {
  config: jest.fn(),
  init: jest.fn(() => Promise.resolve())
};

export default mockEditor;
