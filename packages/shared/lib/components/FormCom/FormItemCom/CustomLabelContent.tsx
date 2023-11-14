import { ReactNode } from 'react';

interface CustomLabelContentProps {
  title: ReactNode;
  tips: ReactNode;
}

const CustomLabelContent: React.FC<CustomLabelContentProps> = (props) => {
  const { title, tips } = props;
  return (
    <div className="label-cont-custom">
      <div>{title}</div>
      <div className="tip-content-box">{tips}</div>
    </div>
  );
};

export default CustomLabelContent;
