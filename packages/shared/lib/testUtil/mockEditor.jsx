const mockEditor = (props) => {
  const { onMount, ...otherProps } = props;
  return <input {...otherProps} />;
};

export default mockEditor;
