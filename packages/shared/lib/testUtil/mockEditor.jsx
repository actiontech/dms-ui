const mockEditor = (props) => {
  const { onMount, ...otherProps } = props;
  return <input {...otherProps} />;
};

export const loader = {
  config: jest.fn(),
  init: jest.fn(() => Promise.resolve())
};

export default mockEditor;
