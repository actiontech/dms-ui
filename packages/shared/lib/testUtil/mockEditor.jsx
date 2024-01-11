import { cloneDeep, isObject } from 'lodash';

const mockEditor = (props) => {
  const { onMount, onChange, ...otherProps } = props;

  const cloneProps = cloneDeep(otherProps);

  Object.keys(cloneProps).forEach((key) => {
    if (isObject(cloneProps[key])) {
      cloneProps[key] = JSON.stringify(cloneProps[key]);
    }
  });
  return <input onChange={(e) => onChange(e.target.value)} {...cloneProps} />;
};

mockEditor.Markdown = (props) => {
  const { onMount, ...otherProps } = props;
  return <input {...otherProps} />;
};

export const loader = {
  config: jest.fn(),
  init: jest.fn(() => Promise.resolve())
};

export default mockEditor;
