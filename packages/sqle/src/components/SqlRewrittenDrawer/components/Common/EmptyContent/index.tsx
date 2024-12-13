import { EmptyOutlined } from '@actiontech/icons';
import { EmptyContentStyleWrapper } from './style';

type Props = {
  text: string;
};

const EmptyContent: React.FC<Props> = ({ text }) => {
  return (
    <EmptyContentStyleWrapper>
      <span className="empty-icon">
        <EmptyOutlined height={32} width={32} />
      </span>
      <span className="empty-text">{text}</span>
    </EmptyContentStyleWrapper>
  );
};

export default EmptyContent;
