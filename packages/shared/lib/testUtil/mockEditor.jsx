const mockEditor = (props) => {
  const { onMount, ...otherProps } = props;
  return <input {...otherProps} />;
};

export const loader = {
  config: () => {},
  init: async () => {}
};

export default mockEditor;
