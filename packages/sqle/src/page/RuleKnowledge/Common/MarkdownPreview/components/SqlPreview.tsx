import { SqlPreviewStyleWrapper } from './style';

interface SqlPreviewProps {
  code: string;
}

const SqlPreview: React.FC<SqlPreviewProps> = ({ code }) => {
  return <SqlPreviewStyleWrapper rows={0} sql={code} tooltip={false} />;
};

export default SqlPreview;
