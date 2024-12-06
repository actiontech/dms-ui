import { ReactNode } from 'react';

export interface CustomLabelContentProps {
  title: ReactNode;
  tips: ReactNode;
}

const CustomLabelContent: React.FC<CustomLabelContentProps> = (props) => {
  const { title, tips } = props;
  return (
    <div className="label-cont-custom">
      <div>{title}</div>
      <div hidden={!tips} className="tip-content-box">
        {tips}
      </div>
    </div>
  );
};

export default CustomLabelContent;
