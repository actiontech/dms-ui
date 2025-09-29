import { EmptyBoxProps } from './EmptyBox.types';

const EmptyBox: React.FC<EmptyBoxProps> = (props) => {
  if (!props.if) {
    return <>{props.defaultNode ?? null}</>;
  }
  return <>{props.children}</>;
};

export default EmptyBox;
