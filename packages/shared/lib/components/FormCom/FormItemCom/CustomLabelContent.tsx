export interface CustomLabelContentProps {
  title: string;
  tips: string;
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
