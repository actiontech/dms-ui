interface IConfigItemLabelContentProps {
  children: React.ReactNode;
  tips?: string;
}

const LabelContent: React.FC<IConfigItemLabelContentProps> = ({
  children,
  tips
}) => {
  return (
    <div className="config-item-label">
      <div className="title">{children}</div>
      {tips && <div className="tips">{tips}</div>}
    </div>
  );
};

export default LabelContent;
